//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package org.mozilla.javascript.tools.debugger;

import java.awt.AWTEvent;
import java.awt.ActiveEvent;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.MenuComponent;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDesktopPane;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JSplitPane;
import javax.swing.JToolBar;
import javax.swing.SwingUtilities;
import javax.swing.filechooser.FileFilter;
import javax.swing.text.BadLocationException;
import org.mozilla.javascript.Kit;
import org.mozilla.javascript.SecurityUtilities;
import org.mozilla.javascript.tools.debugger.ContextWindow;
import org.mozilla.javascript.tools.debugger.Dim;
import org.mozilla.javascript.tools.debugger.FileTextArea;
import org.mozilla.javascript.tools.debugger.FileWindow;
import org.mozilla.javascript.tools.debugger.FindFunction;
import org.mozilla.javascript.tools.debugger.GuiCallback;
import org.mozilla.javascript.tools.debugger.JSInternalConsole;
import org.mozilla.javascript.tools.debugger.Menubar;
import org.mozilla.javascript.tools.debugger.MessageDialogWrapper;
import org.mozilla.javascript.tools.debugger.MoreWindows;
import org.mozilla.javascript.tools.debugger.RunProxy;
import org.mozilla.javascript.tools.debugger.Dim.ContextData;
import org.mozilla.javascript.tools.debugger.Dim.SourceInfo;
import org.mozilla.javascript.tools.debugger.Dim.StackFrame;

public class SwingGui extends JFrame implements GuiCallback {
    private static final long serialVersionUID = -8217029773456711621L;
    Dim dim;
    private Runnable exitAction;
    private JDesktopPane desk;
    private ContextWindow context;
    private Menubar menubar;
    private JToolBar toolBar;
    private JSInternalConsole console;
    private JSplitPane split1;
    private JLabel statusBar;
    private final Map<String, JFrame> toplevels = Collections.synchronizedMap(new HashMap());
    private final Map<String, FileWindow> fileWindows = Collections.synchronizedMap(new HashMap());
    private FileWindow currentWindow;
    JFileChooser dlg;
    private EventQueue awtEventQueue;
    private boolean breakStopped;

    public SwingGui(Dim dim, String title) {
        super(title);
        this.dim = dim;
        this.init();
        dim.setGuiCallback(this);
    }

    public Menubar getMenubar() {
        return this.menubar;
    }

    public void setExitAction(Runnable r) {
        this.exitAction = r;
    }

    public JSInternalConsole getConsole() {
        return this.console;
    }

    public void setVisible(boolean b) {
        super.setVisible(b);
        if(b) {
            this.console.consoleTextArea.requestFocus();
            this.context.split.setDividerLocation(0.5D);

            try {
                this.console.setMaximum(true);
                this.console.setSelected(true);
                this.console.show();
                this.console.consoleTextArea.requestFocus();
            } catch (Exception var3) {
                ;
            }
        }

    }

    void addTopLevel(String key, JFrame frame) {
        if(frame != this) {
            this.toplevels.put(key, frame);
        }

    }

    private void init() {
        this.menubar = new Menubar(this);
        this.setJMenuBar(this.menubar);
        this.toolBar = new JToolBar();
        String[] toolTips = new String[]{"Break (Pause)", "Go (F5)", "Step Into (F11)", "Step Over (F7)", "Step Out (F8)"};
        byte count = 0;
        JButton breakButton;
        JButton button = breakButton = new JButton("Break");
        button.setToolTipText("Break");
        button.setActionCommand("Break");
        button.addActionListener(this.menubar);
        button.setEnabled(true);
        int var12 = count + 1;
        button.setToolTipText(toolTips[count]);
        JButton goButton;
        button = goButton = new JButton("Go");
        button.setToolTipText("Go");
        button.setActionCommand("Go");
        button.addActionListener(this.menubar);
        button.setEnabled(false);
        button.setToolTipText(toolTips[var12++]);
        JButton stepIntoButton;
        button = stepIntoButton = new JButton("Step Into");
        button.setToolTipText("Step Into");
        button.setActionCommand("Step Into");
        button.addActionListener(this.menubar);
        button.setEnabled(false);
        button.setToolTipText(toolTips[var12++]);
        JButton stepOverButton;
        button = stepOverButton = new JButton("Step Over");
        button.setToolTipText("Step Over");
        button.setActionCommand("Step Over");
        button.setEnabled(false);
        button.addActionListener(this.menubar);
        button.setToolTipText(toolTips[var12++]);
        JButton stepOutButton;
        button = stepOutButton = new JButton("Step Out");
        button.setToolTipText("Step Out");
        button.setActionCommand("Step Out");
        button.setEnabled(false);
        button.addActionListener(this.menubar);
        button.setToolTipText(toolTips[var12++]);
        Dimension dim = stepOverButton.getPreferredSize();
        breakButton.setPreferredSize(dim);
        breakButton.setMinimumSize(dim);
        breakButton.setMaximumSize(dim);
        breakButton.setSize(dim);
        goButton.setPreferredSize(dim);
        goButton.setMinimumSize(dim);
        goButton.setMaximumSize(dim);
        stepIntoButton.setPreferredSize(dim);
        stepIntoButton.setMinimumSize(dim);
        stepIntoButton.setMaximumSize(dim);
        stepOverButton.setPreferredSize(dim);
        stepOverButton.setMinimumSize(dim);
        stepOverButton.setMaximumSize(dim);
        stepOutButton.setPreferredSize(dim);
        stepOutButton.setMinimumSize(dim);
        stepOutButton.setMaximumSize(dim);
        this.toolBar.add(breakButton);
        this.toolBar.add(goButton);
        this.toolBar.add(stepIntoButton);
        this.toolBar.add(stepOverButton);
        this.toolBar.add(stepOutButton);
        JPanel contentPane = new JPanel();
        contentPane.setLayout(new BorderLayout());
        this.getContentPane().add(this.toolBar, "North");
        this.getContentPane().add(contentPane, "Center");
        this.desk = new JDesktopPane();
        this.desk.setPreferredSize(new Dimension(600, 300));
        this.desk.setMinimumSize(new Dimension(150, 50));
        this.desk.add(this.console = new JSInternalConsole("JavaScript Console"));
        this.context = new ContextWindow(this);
        this.context.setPreferredSize(new Dimension(600, 120));
        this.context.setMinimumSize(new Dimension(50, 50));
        this.split1 = new JSplitPane(0, this.desk, this.context);
        this.split1.setOneTouchExpandable(true);
        setResizeWeight(this.split1, 0.66D);
        contentPane.add(this.split1, "Center");
        this.statusBar = new JLabel();
        this.statusBar.setText("Thread: ");
        contentPane.add(this.statusBar, "South");
        this.dlg = new JFileChooser();
        FileFilter filter = new FileFilter() {
            public boolean accept(File f) {
                if(f.isDirectory()) {
                    return true;
                } else {
                    String n = f.getName();
                    int i = n.lastIndexOf(46);
                    if(i > 0 && i < n.length() - 1) {
                        String ext = n.substring(i + 1).toLowerCase();
                        if(ext.equals("js")) {
                            return true;
                        }
                    }

                    return false;
                }
            }

            public String getDescription() {
                return "JavaScript Files (*.js)";
            }
        };
        this.dlg.addChoosableFileFilter(filter);
        this.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                SwingGui.this.exit();
            }
        });
    }

    private void exit() {
        if(this.exitAction != null) {
            SwingUtilities.invokeLater(this.exitAction);
        }

        this.dim.setReturnValue(5);
    }

    FileWindow getFileWindow(String url) {
        return url != null && !url.equals("<stdin>")?(FileWindow)this.fileWindows.get(url):null;
    }

    static String getShortName(String url) {
        int lastSlash = url.lastIndexOf(47);
        if(lastSlash < 0) {
            lastSlash = url.lastIndexOf(92);
        }

        String shortName = url;
        if(lastSlash >= 0 && lastSlash + 1 < url.length()) {
            shortName = url.substring(lastSlash + 1);
        }

        return shortName;
    }

    void removeWindow(FileWindow w) {
        this.fileWindows.remove(w.getUrl());
        JMenu windowMenu = this.getWindowMenu();
        int count = windowMenu.getItemCount();
        JMenuItem lastItem = windowMenu.getItem(count - 1);
        String name = getShortName(w.getUrl());

        for(int i = 5; i < count; ++i) {
            JMenuItem item = windowMenu.getItem(i);
            if(item != null) {
                String text = item.getText();
                int pos = text.indexOf(32);
                if(text.substring(pos + 1).equals(name)) {
                    windowMenu.remove(item);
                    if(count == 6) {
                        windowMenu.remove(4);
                    } else {
                        for(int j = i - 4; i < count - 1; ++i) {
                            JMenuItem thisItem = windowMenu.getItem(i);
                            if(thisItem != null) {
                                text = thisItem.getText();
                                if(text.equals("More Windows...")) {
                                    break;
                                }

                                pos = text.indexOf(32);
                                thisItem.setText((char)(48 + j) + " " + text.substring(pos + 1));
                                thisItem.setMnemonic(48 + j);
                                ++j;
                            }
                        }

                        if(count - 6 == 0 && lastItem != item && lastItem.getText().equals("More Windows...")) {
                            windowMenu.remove(lastItem);
                        }
                    }
                    break;
                }
            }
        }

        windowMenu.revalidate();
    }

    void showStopLine(StackFrame frame) {
        this.breakStopped = true;
        try {
            String sourceName = frame.getUrl();
            if (sourceName != null && !sourceName.equals("<stdin>")) {
                this.showFileWindow(sourceName, -1);
                int lineNumber = frame.getLineNumber();
                FileWindow w = this.getFileWindow(sourceName);
                if (w != null) {
                    this.setFilePosition(w, lineNumber);
                }
            } else if (this.console.isVisible()) {
                this.console.show();
            }
        } finally {
            this.breakStopped = false;
        }

    }

    protected void showFileWindow(String sourceUrl, int lineNumber) {
        FileWindow w = this.getFileWindow(sourceUrl);
        if(w == null) {
            SourceInfo exc = this.dim.sourceInfo(sourceUrl);
            this.createFileWindow(exc, -1);
            w = this.getFileWindow(sourceUrl);
        }

        if(lineNumber > -1) {
            int exc1 = w.getPosition(lineNumber - 1);
            int end = w.getPosition(lineNumber) - 1;
            w.textArea.select(exc1);
            w.textArea.setCaretPosition(exc1);
            w.textArea.moveCaretPosition(end);
        }

        try {
            if(w.isIcon()) {
                w.setIcon(false);
            }

            w.setVisible(true);
            w.moveToFront();
            w.setSelected(true);
            this.requestFocus();
            w.requestFocus();
            w.textArea.requestFocus();
        } catch (Exception var6) {
            ;
        }

    }

    protected void createFileWindow(SourceInfo sourceInfo, int line) {
        if (this.breakStopped) {
            boolean activate = true;
            String url = sourceInfo.url();
            FileWindow w = new FileWindow(this, sourceInfo);
            this.fileWindows.put(url, w);
            if (line != -1) {
                if (this.currentWindow != null) {
                    this.currentWindow.setPosition(-1);
                }

                try {
                    w.setPosition(w.textArea.getLineStartOffset(line - 1));
                } catch (BadLocationException var10) {
                    try {
                        w.setPosition(w.textArea.getLineStartOffset(0));
                    } catch (BadLocationException var9) {
                        w.setPosition(-1);
                    }
                }
            }

            this.desk.add(w);
            if (line != -1) {
                this.currentWindow = w;
            }

            this.menubar.addFile(url);
            w.setVisible(true);
            if (activate) {
                try {
                    w.setMaximum(true);
                    w.setSelected(true);
                    w.moveToFront();
                } catch (Exception var8) {
                    ;
                }
            }
        }
    }

    protected boolean updateFileWindow(SourceInfo sourceInfo) {
        String fileName = sourceInfo.url();
        FileWindow w = this.getFileWindow(fileName);
        if(w != null) {
            w.updateText(sourceInfo);
            w.show();
            return true;
        } else {
            return false;
        }
    }

    private void setFilePosition(FileWindow w, int line) {
        boolean activate = true;
        FileTextArea ta = w.textArea;

        try {
            if(line == -1) {
                w.setPosition(-1);
                if(this.currentWindow == w) {
                    this.currentWindow = null;
                }
            } else {
                int exc = ta.getLineStartOffset(line - 1);
                if(this.currentWindow != null && this.currentWindow != w) {
                    this.currentWindow.setPosition(-1);
                }

                w.setPosition(exc);
                this.currentWindow = w;
            }
        } catch (BadLocationException var7) {
            ;
        }

        if(activate) {
            if(w.isIcon()) {
                this.desk.getDesktopManager().deiconifyFrame(w);
            }

            this.desk.getDesktopManager().activateFrame(w);

            try {
                w.show();
                w.toFront();
                w.setSelected(true);
            } catch (Exception var6) {
                ;
            }
        }

    }

    void enterInterruptImpl(StackFrame lastFrame, String threadTitle, String alertMessage) {
        this.statusBar.setText("Thread: " + threadTitle);
        this.showStopLine(lastFrame);
        if(alertMessage != null) {
            MessageDialogWrapper.showMessageDialog(this, alertMessage, "Exception in Script", 0);
        }

        this.updateEnabled(true);
        ContextData contextData = lastFrame.contextData();
        JComboBox ctx = this.context.context;
        List toolTips = this.context.toolTips;
        this.context.disableUpdate();
        int frameCount = contextData.frameCount();
        ctx.removeAllItems();
        ctx.setSelectedItem((Object)null);
        toolTips.clear();

        for(int i = 0; i < frameCount; ++i) {
            StackFrame frame = contextData.getFrame(i);
            String url = frame.getUrl();
            int lineNumber = frame.getLineNumber();
            String shortName = url;
            if(url.length() > 20) {
                shortName = "..." + url.substring(url.length() - 17);
            }

            String location = "\"" + shortName + "\", line " + lineNumber;
            ctx.insertItemAt(location, i);
            location = "\"" + url + "\", line " + lineNumber;
            toolTips.add(location);
        }

        this.context.enableUpdate();
        ctx.setSelectedIndex(0);
        ctx.setMinimumSize(new Dimension(50, ctx.getMinimumSize().height));
    }

    private JMenu getWindowMenu() {
        return this.menubar.getMenu(3);
    }

    private String chooseFile(String title) {
        this.dlg.setDialogTitle(title);
        File CWD = null;
        String dir = SecurityUtilities.getSystemProperty("user.dir");
        if(dir != null) {
            CWD = new File(dir);
        }

        if(CWD != null) {
            this.dlg.setCurrentDirectory(CWD);
        }

        int returnVal = this.dlg.showOpenDialog(this);
        if(returnVal == 0) {
            try {
                String ignored = this.dlg.getSelectedFile().getCanonicalPath();
                CWD = this.dlg.getSelectedFile().getParentFile();
                Properties props = System.getProperties();
                props.put("user.dir", CWD.getPath());
                System.setProperties(props);
                return ignored;
            } catch (IOException var7) {
                ;
            } catch (SecurityException var8) {
                ;
            }
        }

        return null;
    }

    private JInternalFrame getSelectedFrame() {
        JInternalFrame[] frames = this.desk.getAllFrames();

        for(int i = 0; i < frames.length; ++i) {
            if(frames[i].isShowing()) {
                return frames[i];
            }
        }

        return frames[frames.length - 1];
    }

    private void updateEnabled(boolean interrupted) {
        ((Menubar)this.getJMenuBar()).updateEnabled(interrupted);
        int state = 0;

        for(int cc = this.toolBar.getComponentCount(); state < cc; ++state) {
            boolean enableButton;
            if(state == 0) {
                enableButton = !interrupted;
            } else {
                enableButton = interrupted;
            }

            this.toolBar.getComponent(state).setEnabled(enableButton);
        }

        if(interrupted) {
            this.toolBar.setEnabled(true);
            state = this.getExtendedState();
            if(state == 1) {
                this.setExtendedState(0);
            }

            this.toFront();
            this.context.setEnabled(true);
        } else {
            if(this.currentWindow != null) {
                this.currentWindow.setPosition(-1);
            }

            this.context.setEnabled(false);
        }

    }

    static void setResizeWeight(JSplitPane pane, double weight) {
        try {
            Method exc = JSplitPane.class.getMethod("setResizeWeight", new Class[]{Double.TYPE});
            exc.invoke(pane, new Object[]{new Double(weight)});
        } catch (NoSuchMethodException var4) {
            ;
        } catch (IllegalAccessException var5) {
            ;
        } catch (InvocationTargetException var6) {
            ;
        }

    }

    private String readFile(String fileName) {
        String text;
        try {
            FileReader ex = new FileReader(fileName);

            try {
                text = Kit.readReader(ex);
            } finally {
                ex.close();
            }
        } catch (IOException var8) {
            MessageDialogWrapper.showMessageDialog(this, var8.getMessage(), "Error reading " + fileName, 0);
            text = null;
        }

        return text;
    }

    public void updateSourceText(SourceInfo sourceInfo) {
        RunProxy proxy = new RunProxy(this, 3);
        proxy.sourceInfo = sourceInfo;
        SwingUtilities.invokeLater(proxy);
    }

    public void enterInterrupt(StackFrame lastFrame, String threadTitle, String alertMessage) {
        if(SwingUtilities.isEventDispatchThread()) {
            this.enterInterruptImpl(lastFrame, threadTitle, alertMessage);
        } else {
            RunProxy proxy = new RunProxy(this, 4);
            proxy.lastFrame = lastFrame;
            proxy.threadTitle = threadTitle;
            proxy.alertMessage = alertMessage;
            SwingUtilities.invokeLater(proxy);
        }

    }

    public boolean isGuiEventThread() {
        return SwingUtilities.isEventDispatchThread();
    }

    public void dispatchNextGuiEvent() throws InterruptedException {
        EventQueue queue = this.awtEventQueue;
        if(queue == null) {
            queue = Toolkit.getDefaultToolkit().getSystemEventQueue();
            this.awtEventQueue = queue;
        }

        AWTEvent event = queue.getNextEvent();
        if(event instanceof ActiveEvent) {
            ((ActiveEvent)event).dispatch();
        } else {
            Object source = event.getSource();
            if(source instanceof Component) {
                Component comp = (Component)source;
                comp.dispatchEvent(event);
            } else if(source instanceof MenuComponent) {
                ((MenuComponent)source).dispatchEvent(event);
            }
        }

    }

    public void actionPerformed(ActionEvent e) {
        String cmd = e.getActionCommand();
        byte returnValue = -1;
        if(!cmd.equals("Cut") && !cmd.equals("Copy") && !cmd.equals("Paste")) {
            if(cmd.equals("Step Over")) {
                returnValue = 0;
            } else if(cmd.equals("Step Into")) {
                returnValue = 1;
            } else if(cmd.equals("Step Out")) {
                returnValue = 2;
            } else if(cmd.equals("Go")) {
                returnValue = 3;
            } else if(cmd.equals("Break")) {
                this.dim.setBreak();
            } else if(cmd.equals("Exit")) {
                this.exit();
            } else {
                String w;
                RunProxy exc;
                String var21;
                if(cmd.equals("Open")) {
                    var21 = this.chooseFile("Select a file to compile");
                    if(var21 != null) {
                        w = this.readFile(var21);
                        if(w != null) {
                            exc = new RunProxy(this, 1);
                            exc.fileName = var21;
                            exc.text = w;
                            (new Thread(exc)).start();
                        }
                    }
                } else if(cmd.equals("Load")) {
                    var21 = this.chooseFile("Select a file to execute");
                    if(var21 != null) {
                        w = this.readFile(var21);
                        if(w != null) {
                            exc = new RunProxy(this, 2);
                            exc.fileName = var21;
                            exc.text = w;
                            (new Thread(exc)).start();
                        }
                    }
                } else if(cmd.equals("More Windows...")) {
                    MoreWindows var22 = new MoreWindows(this, this.fileWindows, "Window", "Files");
                    var22.showDialog(this);
                } else if(cmd.equals("Console")) {
                    if(this.console.isIcon()) {
                        this.desk.getDesktopManager().deiconifyFrame(this.console);
                    }

                    this.console.show();
                    this.desk.getDesktopManager().activateFrame(this.console);
                    this.console.consoleTextArea.requestFocus();
                } else if(!cmd.equals("Cut") && !cmd.equals("Copy") && !cmd.equals("Paste")) {
                    if(cmd.equals("Go to function...")) {
                        FindFunction var23 = new FindFunction(this, "Go to function", "Function");
                        var23.showDialog(this);
                    } else {
                        int y;
                        int h;
                        int d;
                        int i;
                        JInternalFrame[] var24;
                        int var25;
                        int var28;
                        if(cmd.equals("Tile")) {
                            var24 = this.desk.getAllFrames();
                            var25 = var24.length;
                            var28 = y = (int)Math.sqrt((double)var25);
                            if(var28 * y < var25) {
                                ++y;
                                if(var28 * y < var25) {
                                    ++var28;
                                }
                            }

                            Dimension w1 = this.desk.getSize();
                            h = w1.width / y;
                            d = w1.height / var28;
                            i = 0;
                            int f = 0;

                            for(int dimen = 0; dimen < var28; ++dimen) {
                                for(int j = 0; j < y; ++j) {
                                    int index = dimen * y + j;
                                    if(index >= var24.length) {
                                        break;
                                    }

                                    JInternalFrame f1 = var24[index];

                                    try {
                                        f1.setIcon(false);
                                        f1.setMaximum(false);
                                    } catch (Exception var20) {
                                        ;
                                    }

                                    this.desk.getDesktopManager().setBoundsForFrame(f1, i, f, h, d);
                                    i += h;
                                }

                                f += d;
                                i = 0;
                            }
                        } else if(cmd.equals("Cascade")) {
                            var24 = this.desk.getAllFrames();
                            var25 = var24.length;
                            y = 0;
                            var28 = 0;
                            h = this.desk.getHeight();
                            d = h / var25;
                            if(d > 30) {
                                d = 30;
                            }

                            for(i = var25 - 1; i >= 0; y += d) {
                                JInternalFrame var30 = var24[i];

                                try {
                                    var30.setIcon(false);
                                    var30.setMaximum(false);
                                } catch (Exception var19) {
                                    ;
                                }

                                Dimension var31 = var30.getPreferredSize();
                                int var29 = var31.width;
                                h = var31.height;
                                this.desk.getDesktopManager().setBoundsForFrame(var30, var28, y, var29, h);
                                --i;
                                var28 += d;
                            }
                        } else {
                            FileWindow var26 = this.getFileWindow(cmd);
                            if(var26 != null) {
                                FileWindow var27 = (FileWindow)var26;

                                try {
                                    if(var27.isIcon()) {
                                        var27.setIcon(false);
                                    }

                                    var27.setVisible(true);
                                    var27.moveToFront();
                                    var27.setSelected(true);
                                } catch (Exception var18) {
                                    ;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            JInternalFrame obj = this.getSelectedFrame();
            if(obj != null && obj instanceof ActionListener) {
                ((ActionListener)obj).actionPerformed(e);
            }
        }

        if(returnValue != -1) {
            this.updateEnabled(false);
            this.dim.setReturnValue(returnValue);
        }

    }
}
