/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

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
