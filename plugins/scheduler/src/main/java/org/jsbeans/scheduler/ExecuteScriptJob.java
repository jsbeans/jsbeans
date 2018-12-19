package org.jsbeans.scheduler;

import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.scripting.ExecuteScriptMessage;
import org.jsbeans.scripting.JsHub;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import akka.actor.ActorRef;

public class ExecuteScriptJob implements Job {

	@Override
	public void execute(JobExecutionContext ctx) throws JobExecutionException {
		String script = ctx.getMergedJobDataMap().get("script").toString();
		ExecuteScriptMessage execMsg = new ExecuteScriptMessage(script);
		execMsg.setRespond(false);
		
		ActorHelper.getActorSelection(JsHub.class).tell(execMsg, ActorRef.noSender());
	}

}
