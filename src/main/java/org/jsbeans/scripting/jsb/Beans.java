package org.jsbeans.scripting.jsb;

import com.google.common.primitives.Bytes;
import org.jsbeans.PlatformException;
import org.jsbeans.Starter;
import org.jsbeans.helpers.FileHelper;
import org.jsbeans.helpers.ReflectionHelper;
import org.jsbeans.types.Tuple;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.function.UnaryOperator;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public interface Beans {
    interface Bean {
        String getURI();

        String getBaseLocation();

        InputStream getInputStream() throws IOException;

        default String getFullLocation() {
            return Paths.get(getBaseLocation(), getURI()).toString();
        }

        default String read() throws IOException {
            try (InputStream is = this.getInputStream();
                 InputStreamReader ir = new InputStreamReader(is, StandardCharsets.UTF_8);
                 BufferedReader br = new BufferedReader(ir)) {
                String body = br.lines().collect(Collectors.joining("\n"));
                return body;
            }
        }
    }

    enum Type {
        core, system, server, application
    }

    interface Provider extends Iterable<Bean>, AutoCloseable {
        Bean find(String uri);
    }

    class FileProvider implements Provider {
        Collection<String> paths;

        public FileProvider(Collection<String> paths) {
            this.paths = paths;
        }

        @Override
        public Bean find(String uri) {
            return this.enumerate(uri::equals).findFirst().get();
        }

        @Override
        public Iterator<Bean> iterator() {
            return this.enumerate(uri->true).iterator();
        }

        @Override
        public void close() throws Exception {
        }

        Stream<Bean> enumerate(Predicate<String> filter) {
            return paths.stream()
                    .flatMap(path ->
                            FileHelper.searchFiles(path, "**/*.jsb").stream()
                                    .map(file -> file.replaceAll("\\\\", "/").substring(path.length()))
                                    .filter(filter)
                                    .map(uri -> (Bean) new Bean() {
                                        @Override
                                        public String getURI() {
                                            return uri;
                                        }

                                        @Override
                                        public String getBaseLocation() {
                                            return path;
                                        }

                                        @Override
                                        public InputStream getInputStream() throws IOException {
                                            return Files.newInputStream(Paths.get(path, uri), StandardOpenOption.READ);
                                        }
                                    })
                    );

        }
    }

    class ResourceProvider implements Provider {
        Collection<String> paths;
        Pattern search;

        public ResourceProvider(Collection<String> paths, Pattern search) {
            this.paths = paths;
            this.search = search;
        }

        @Override
        public Bean find(String uri) {
            return this.enumerate(u ->
                    u.equalsIgnoreCase(uri)
            ).findFirst().get();
        }

        @Override
        public Iterator<Bean> iterator() {
            return this.enumerate(uri->true).iterator();
        }

        @Override
        public void close() throws Exception {
        }


        Stream<Bean> enumerate(Predicate<String> filter) {
            return ReflectionHelper.getPlatformReflections()
                    .getResources(search).stream()
                    .map("/"::concat)
                    .flatMap(res->
                            paths.stream().map(p ->
                                            res.startsWith(p)
                                            ? new Tuple<>(res.substring(p.length()), res)
                                            : new Tuple<>("", res)))
                    .filter(t->!t.getFirst().isEmpty())
                    .filter(t->
                            filter.test(t.getFirst()))
                    .map(t ->
                            (Bean) new Bean() {
                                    String uri = t.getFirst();
                                    String path = t.getSecond();
                                    @Override
                                    public String getURI() {
                                        return uri;
                                    }

                                    @Override
                                    public String getBaseLocation() {
                                        return path.substring(0, path.indexOf(uri));
                                    }

                                    @Override
                                    public InputStream getInputStream() throws IOException {
                                        return Starter.class.getResourceAsStream(path);
                                    }
                                });

        }
    }

    class ZippedProvider implements Provider {
        String path;
        Supplier<InputStream> zipped;
        InputStream zis;

        public ZippedProvider(Supplier<InputStream> zipped, Collection<String> paths) {
            this.zipped = zipped;
            this.path = paths.stream().findFirst().orElse("");
        }

        @Override
        public void close() throws Exception {
            if(zis != null) {
                zis.close();
            }
        }

        @Override
        public Bean find(String uri) {
            return StreamSupport.stream(this.spliterator(), false)
                    .filter( bean -> bean.getURI().equalsIgnoreCase(uri))
                    .findFirst().get();
        }

        @Override
        public Iterator<Bean> iterator() {
            try {
                if(zis != null) {
                    zis.close();
                }
                this.zis = zipped.get();
            } catch (IOException e) {
                throw new PlatformException(e);
            }
            ZipInputStream zip = new ZipInputStream(zis, StandardCharsets.UTF_8);
            return new Iterator<Bean>() {
                ZipEntry entry;
                @Override
                public boolean hasNext() {
                    try {
                        entry = zip.getNextEntry();
                        return entry != null;
                    } catch (IOException e) {
                       throw new PlatformException(e);
                    }
                }

                @Override
                public Bean next() {
                    try {
                        byte[] buf = new byte[1024];
                        String file = entry.getName();
                        ArrayList<Byte> all = new ArrayList<>(1024);
                        int len;
                        int total = 0;
                        while((len = zip.read(buf, 0,1024)) > 0) {
                            total += len;
                            all.addAll(Bytes.asList(buf).subList(0, len));
                        }
                        byte[] buffer = Bytes.toArray(all);
                        zip.closeEntry();
                        return new Bean() {
                            @Override
                            public String getURI() {
                                return file;
                            }

                            @Override
                            public String getFullLocation() {
                                return getURI();
                            }

                            @Override
                            public String getBaseLocation() {
                                return path;
                            }

                            @Override
                            public InputStream getInputStream() throws IOException {
                                return new ByteArrayInputStream(buffer);
                            }
                        };
                    } catch (IOException e) {
                        throw new PlatformException(e);
                    }
                }
            };
        }

        public static void writeAsZip(Provider provider, OutputStream out) {
            try (ZipOutputStream zip = new ZipOutputStream(out, StandardCharsets.UTF_8)){
                provider.forEach(bean -> {
                    try(InputStream is = bean.getInputStream()) {
                        byte[]buffer = new byte[is.available()];

                        ZipEntry entry = new ZipEntry(bean.getURI());
                        entry.setSize(buffer.length);
                        zip.putNextEntry(entry);
                        is.read(buffer);
                        zip.write(buffer);
                        zip.closeEntry();
                    } catch (IOException e) {
                        throw new PlatformException(e);
                    }
                });
            } catch (IOException e) {
                throw new PlatformException(e);
            }
        }
    }

    class RemoteProvider implements Provider {
        HttpURLConnection http;
        ZippedProvider zipped;
        public RemoteProvider(String url, UnaryOperator<InputStream> decoder, Collection<String> paths) {
                zipped = new ZippedProvider(() -> {
                    try {
                        if (http != null) {
                            http.disconnect();
                        }
                        http = (HttpURLConnection) new URL(url).openConnection();
                        http.setRequestMethod("GET");
                        http.setConnectTimeout(15000);
                        http.setReadTimeout(15000);
                        http.setRequestProperty("charset", "UTF-8");
                        return decoder != null ? decoder.apply(http.getInputStream()) : http.getInputStream();
                    } catch (IOException e) {
                        throw new PlatformException(e);
                    }
                }, paths);
        }

        @Override
        public void close() throws Exception {
            zipped.close();
            if (http != null) {
                http.disconnect();
            }
        }

        @Override
        public Bean find(String uri) {
            return zipped.find(uri);
        }

        @Override
        public Iterator<Bean> iterator() {
            return zipped.iterator();
        }
    }
/*
    class EncoderDecoder {
        private static int keySize = 128;
        private static String transformation = "AES/CBC/PKCS5Padding";
        private static String algorithm = "AES";

        private static KeyGenerator keyGenerator;
        private static SecretKey key;
        private static Cipher cipher;
        private static Cipher cipherDecrypt;

        static {
            try {
                keyGenerator = KeyGenerator.getInstance(algorithm);
                keyGenerator.init(keySize);
                key = keyGenerator.generateKey();
                cipher = Cipher.getInstance(transformation);
                cipherDecrypt = Cipher.getInstance(transformation);
                cipher.init(Cipher.ENCRYPT_MODE, key);
                cipherDecrypt.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(cipher.getIV()));
            } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | InvalidAlgorithmParameterException e) {
                throw new PlatformException(e);
            }
        }

        public static UnaryOperator<InputStream> decoder() {
            return inputStream -> {
                try {
                    BufferedInputStream decoderStream = new BufferedInputStream(new CipherInputStream(inputStream, cipherDecrypt));
                    return new InputStream() {
                        @Override
                        public int read() throws IOException {
                            return decoderStream.read();
                        }

                        @Override
                        public int read(byte[] bytes) throws IOException {
                            return decoderStream.read(bytes);
                        }

                        @Override
                        public int read(byte[] bytes, int i, int i1) throws IOException {
                            return decoderStream.read(bytes, i, i1);
                        }

                        @Override
                        public long skip(long l) throws IOException {
                            return decoderStream.skip(l);
                        }

                        @Override
                        public int available() throws IOException {
                            return decoderStream.available();
                        }

                        @Override
                        public void close() throws IOException {
                            decoderStream.close();
                        }

                        @Override
                        public synchronized void mark(int i) {
                            decoderStream.mark(i);
                        }

                        @Override
                        public synchronized void reset() throws IOException {
                            decoderStream.reset();
                        }

                        @Override
                        public boolean markSupported() {
                            return decoderStream.markSupported();
                        }
                    };
                } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | InvalidAlgorithmParameterException e) {
                    throw new PlatformException(e);
                }
            };
        }

        public static UnaryOperator<OutputStream> encoder() {
            return destStream -> {
                    OutputStream encoderStream = new BufferedOutputStream(new CipherOutputStream(destStream, cipherEncrypt()));
                    return new OutputStream() {
                        @Override
                        public void write(byte[] bytes) throws IOException {
                            encoderStream.write(bytes);
                        }

                        @Override
                        public void write(byte[] bytes, int i, int i1) throws IOException {
                            encoderStream.write(bytes, i, i1);
                        }

                        @Override
                        public void flush() throws IOException {
                            encoderStream.flush();
                        }

                        @Override
                        public void close() throws IOException {
                            encoderStream.close();
                        }

                        @Override
                        public void write(int i) throws IOException {
                            encoderStream.write(i);
                        }
                    };
                } catch (NoSuchPaddingException | NoSuchAlgorithmException | InvalidKeyException e) {
                    throw new PlatformException(e);
                }
            };
        }
    }
    */

    class EncoderDecoder {
        public static UnaryOperator<InputStream> decoder(byte[] decodeKey) {
            return decoderPipe(decodeKey);
//            return decoderXor(decodeKey);
        }

        public static UnaryOperator<OutputStream> encoder(byte[] encodeKey) {
            return encoderPipe(encodeKey);
//            return encoderXor(encodeKey);
        }
        public static UnaryOperator<InputStream> decoderPipe(byte[] decodeKey) {
            return i -> i;
        }

        public static UnaryOperator<OutputStream> encoderPipe(byte[] encodeKey) {
            return o -> o;
        }

        private static UnaryOperator<InputStream> decoderXor(byte[] key) {
            return in -> new InputStream() {
                int offset = 0;
                @Override
                public int read() throws IOException {
                    int i = in.read();
                    int o = ( i ^ key[offset % (key.length)] ) & 0xFF;
                    offset++;
                    return o;
                }

                @Override
                public long skip(long l) throws IOException {
                    offset += l;
                    return in.skip(l);
                }

                @Override
                public int available() throws IOException {
                    return in.available();
                }

                @Override
                public void close() throws IOException {
                    in.close();
                }

                @Override
                public synchronized void mark(int i) {
                    in.mark(i);
                }

                @Override
                public synchronized void reset() throws IOException {
                    offset = 0;
                    in.reset();
                }
            };
        }

        private static UnaryOperator<OutputStream> encoderXor(byte[] key) {
            return out -> new OutputStream() {
                int offset = 0;

                @Override
                public void flush() throws IOException {
                    out.flush();
                }

                @Override
                public void close() throws IOException {
                    out.close();
                }

                @Override
                public void write(int i) throws IOException {
                    int o = ( i ^ key[offset % (key.length)] ) & 0xFF;
                    out.write(o);
                    offset++;
                }
            };
        }
    }

}
