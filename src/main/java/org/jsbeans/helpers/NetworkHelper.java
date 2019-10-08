/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

/**
 *
 */
package org.jsbeans.helpers;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.*;

public class NetworkHelper {
    private static String selfAddress = null;

    public static String detectSelfAddress() throws SocketException {
        if (selfAddress != null) {
            return selfAddress;
        }
        String ipAddr = "";

        Enumeration<NetworkInterface> nets = NetworkInterface.getNetworkInterfaces();
        for (Object obj : Collections.list(nets)) {
            NetworkInterface netint = (NetworkInterface) obj;
/*        	
            System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			System.out.println(String.format("getName: %s", netint.getName()));
			System.out.println(String.format("getDisplayName: %s", netint.getDisplayName()));
			System.out.println(String.format("getHardwareAddress: %s", Arrays.toString(netint.getHardwareAddress())));
			System.out.println(String.format("getMTU: %d", netint.getMTU()));
			System.out.println(String.format("isLoopback: %b", netint.isLoopback()));
			System.out.println(String.format("isPointToPoint: %b", netint.isPointToPoint()));
			System.out.println(String.format("isUp: %b", netint.isUp()));
			System.out.println(String.format("isVirtual: %b", netint.isVirtual()));
			System.out.println(String.format("supportsMulticast: %b", netint.supportsMulticast()));
*/
            if (netint.isLoopback() || !netint.isUp()) {
                continue;
            }

            Enumeration<InetAddress> addrs = netint.getInetAddresses();
            while (addrs.hasMoreElements()) {
                InetAddress addr = addrs.nextElement();
/*				
				System.out.println("========================");
				System.out.println(String.format("getCanonicalHostName: %s", addr.getCanonicalHostName()));
				System.out.println(String.format("getHostAddress: %s", addr.getHostAddress()));
				System.out.println(String.format("getHostName: %s", addr.getHostName()));
				System.out.println(String.format("isAnyLocalAddress: %b", addr.isAnyLocalAddress()));
				System.out.println(String.format("isSiteLocalAddress: %b", addr.isSiteLocalAddress()));
				System.out.println(String.format("isLinkLocalAddress: %b", addr.isLinkLocalAddress()));
				System.out.println(String.format("isLoopbackAddress: %b", addr.isLoopbackAddress()));
				System.out.println(String.format("isMCGlobal: %b", addr.isMCGlobal()));
				System.out.println(String.format("isMCNodeLocal: %b", addr.isMCNodeLocal()));
				System.out.println(String.format("isMCOrgLocal: %b", addr.isMCOrgLocal()));
				System.out.println(String.format("isMCSiteLocal: %b", addr.isMCSiteLocal()));
				System.out.println(String.format("isMulticastAddress: %b", addr.isMulticastAddress()));
*/
                if (addr.isSiteLocalAddress()) {
                    ipAddr = addr.getHostAddress();
                    break;
                }
            }
            if (ipAddr.length() > 0) {
                break;
            }
        }
        return selfAddress = ipAddr;
    }

    public static Collection<String> findOtherPotentialNodesInSameNetwork(String selfAddr) throws UnknownHostException, IOException {
        Set<String> otherNodes = new HashSet<String>();
/*		
		int idx = selfAddr.lastIndexOf(".");
		String subNet = selfAddr.substring(0, idx);
		int lastNum = Integer.parseInt(selfAddr.substring(idx + 1));
		byte[] subnet = {(byte) 192,(byte) 168, (byte)40, (byte)0 };
		for( int i = 1; i < 254; i++ ) {
			if(i == lastNum ){
				continue;	// skip self
			}
			String potentialHost = subNet + "." + i;
			subnet[3] = (byte) i;
			InetAddress ia = InetAddress.getByAddress(subnet);
			if (ia.isReachable(5000)){
				otherNodes.add(potentialHost);
			}
		}
*/
        return otherNodes;
    }
}
