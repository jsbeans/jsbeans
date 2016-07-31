package org.jsbeans.services;

import akka.actor.ActorRef;
import akka.actor.DeadLetter;
import akka.actor.Terminated;
import com.typesafe.config.ConfigValue;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.helpers.ExceptionHelper;
import org.jsbeans.helpers.ReflectionHelper;
import org.jsbeans.messages.Message;

import java.util.*;

// TODO отключение сервиса, от которого зависят другие, приведет к зависанию, необходимо переделать инициализацию
public class ServiceManagerService extends Service {

    private Map<String, ActorRef> serviceMap = new HashMap<String, ActorRef>();
    private Map<String, Set<String>> dependsMap = new HashMap<String, Set<String>>();
    private Map<String, Set<String>> affectsMap = new HashMap<String, Set<String>>();
    private Set<String> notInitializedServices = new HashSet<String>();
    private long tStart;
    public ServiceManagerService() {
        super();
    }

    @Override
    protected void onInit() {
        this.tStart = System.currentTimeMillis();
        this.reloadServices();
    }

    @Override
    public void preStart() throws PlatformException {
        if (ConfigHelper.isConfigExist("kernel.printDeadLetters"))
            if (ConfigHelper.getConfigBoolean("kernel.printDeadLetters")) {
                Core.getActorSystem().eventStream().subscribe(getSelf(), DeadLetter.class);
            }
        super.preStart();
    }
//	
//	@Override
//	public void preStart() throws PlatformException {
//		super.preStart();
////		if(!this.getClass().equals(ServiceManagerService.class)){
//			getSelf().tell(Message.SVC_LOADED, this.getSelf());	
////		}
//	}
//

    private void setupDeps(Class<? extends Service> clazz) {
        String svcName = ActorHelper.generateName(clazz);

        DependsOn depAnnot = clazz.getAnnotation(DependsOn.class);
        if (depAnnot != null) {
            for (Class<? extends Service> depClass : depAnnot.value()) {
                if (depClass.equals(ServiceManagerService.class)) {
                    continue;
                }
                String depName = ActorHelper.generateName(depClass);

                // set deps
                Set<String> deps = null;
                if (this.dependsMap.containsKey(svcName)) {
                    deps = this.dependsMap.get(svcName);
                } else {
                    deps = new HashSet<String>();
                    this.dependsMap.put(svcName, deps);
                }
                if (!deps.contains(depName)) {
                    deps.add(depName);
                }

                //set affects
                Set<String> affects = null;
                if (this.affectsMap.containsKey(depName)) {
                    affects = this.affectsMap.get(depName);
                } else {
                    affects = new HashSet<String>();
                    this.affectsMap.put(depName, affects);
                }
                if (!affects.contains(svcName)) {
                    affects.add(svcName);
                }

            }
        }
    }

    private void reloadServices() {
        Collection<Class<? extends Service>> foundServices = ReflectionHelper.scanServices();
        Collection<Class<? extends Service>> enabledServices = foundServices;


        for (Class<? extends Service> clazz : enabledServices) {
            this.getLog().debug("Found service class {}", clazz.getName());

            // skip ServiceManager because it's already loaded
            if (clazz.equals(this.getClass())) {
                continue;
            }

            this.setupDeps(clazz);
            if (clazz.getName().contains("$")) {
                continue;
            }
            this.startService(clazz);
        }
        this.completeInitialization();
    }

    private boolean isServiceMathed(Class<? extends Service> e, List<?> list) {
        for (Object v : list) {
            ConfigValue cv = (ConfigValue) v;
            if (cv.unwrapped().toString().equalsIgnoreCase(e.getSimpleName())) {
                return true;
            }
        }
        return false;
    }

    private ActorRef startService(Class<? extends Service> clazz) {
        String svcName = ActorHelper.generateName(clazz);
        if (serviceMap.containsKey(svcName)) {
            return null;
        }
        this.notInitializedServices.add(svcName);
        ActorRef svcRef = ActorHelper.actorOf(clazz, ActorHelper.generateName(clazz));
        this.getContext().watch(svcRef);
        this.serviceMap.put(svcName, svcRef);

        return svcRef;
    }

    @Override
    public void onMessage(Object msg) throws PlatformException {
        if (msg instanceof Terminated) {
            this.performTerminatedMessage((Terminated) msg);
        } else if (msg instanceof String) {
            this.onStringMessage((String) msg);
        } else if (msg instanceof DeadLetter) {
            DeadLetter dl = (DeadLetter) msg;


            String message = null;
            if (dl.message() == null) message = "null";
            else if (dl.message() instanceof Throwable) {
                Throwable th = (Throwable) dl.message();
                message = th.getMessage() + "\n\t" + ExceptionHelper.getStackTrace(th);
                if (th.getCause() != null) {
                    message += "\ncause\n";
                    message += th.getCause().getMessage() + "\n\t" + ExceptionHelper.getStackTrace(th.getCause());
                }
            }

            getLog().warning(String.format("Dead letter %n\tfrom=%s %n\tto=%s %n\nmessage=%s", dl.sender(), dl.recipient(), message));
        } else if (msg instanceof Throwable) {
            getLog().error((Throwable) msg, msg.toString());
        } else {
            unhandled(msg);
        }
    }

    private void onStringMessage(String msg) throws PlatformException {
        if (msg.equals(Message.SVC_LOADED)) {
            this.tryToInitService(ActorHelper.getServiceNameForActor(this.getSender()));
        } else if (msg.equals(Message.SVC_INIT_COMPLETE)) {
            this.resolveDepsForService(ActorHelper.getServiceNameForActor(this.getSender()));
        } else if (msg.equals(Message.SVC_LIST)) {
            ServiceMessage mmm = new ServiceMessage();
            mmm.getCollection().addAll(this.serviceMap.keySet());
            this.getSender().tell(mmm, this.getSelf());
        } else {
            unhandled(msg);
        }
    }

    private void resolveDepsForService(String svcName) throws PlatformException {
        if (this.notInitializedServices.contains(svcName)) {
            this.notInitializedServices.remove(svcName);
            if (this.notInitializedServices.size() == 0) {
                Core.getActorSystem().eventStream().publish(new Initialized());
                this.getLog().info(String.format("System initialized. Time taken: %.2f sec.", (double) (System.currentTimeMillis() - this.tStart) / 1000));
            }
        }
        if (!this.affectsMap.containsKey(svcName)) {
            return;
        }
        Set<String> affects = this.affectsMap.get(svcName);
        for (String affSvc : affects) {
            if (this.dependsMap.containsKey(affSvc)) {
                Set<String> affSvcDeps = this.dependsMap.get(affSvc);
                if (affSvcDeps.contains(svcName)) {
                    affSvcDeps.remove(svcName);
                }
                if (affSvcDeps.size() == 0) {
                    this.dependsMap.remove(affSvc);
                    this.tryToInitService(affSvc);
                }
            } else {
                throw new PlatformException("Internal error occured due to resolving dependencies");
            }
        }
        affects.clear();
        this.affectsMap.remove(svcName);
    }

    private void tryToInitService(String svcName) {
        if (this.dependsMap.containsKey(svcName)) {
            if (this.dependsMap.get(svcName).size() > 0) {
                return;
            }
            this.dependsMap.remove(svcName);
        }

        // proceed service initialization
        ActorHelper.getActorSelection(svcName).tell(Message.SVC_INIT, this.getSelf());
    }

    private void performTerminatedMessage(Terminated msg) {
        String svcName = msg.getActor().path().name();
        if (serviceMap.containsKey(svcName)) {
            serviceMap.remove(svcName);
        }
    }

    public static class Initialized implements Message {
        private static final long serialVersionUID = 628740839476831749L;

    }

}
