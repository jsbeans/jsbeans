/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.security;

import org.jsbeans.types.JsonObject;

public interface PermissionsRepository {
    /**
     * Проверка наличия у пользователя разрешения
     *
     * @param user       пользователь
     * @param permission идентификатор разрешения
     * @return атрибуты разрешения, если оно есть, null - если нет
     */
    JsonObject checkPermission(String user, String permission, boolean use);

    /**
     * Добавить пользователю разрешение. Во-первых, пользователю добавляется ключ, если не задан - генерируется и добавляется.
     * Во-вторых, добавляется сами разрешения.
     *
     * @param user       пользователь
     * @param key        ключ разрешений, если не задан, то генерируется уникальный
     * @param permission идентификатор или префикс идентификатора разрешения
     * @param attributes атрибуты разрешения (напрмиер, {expired: {time: Date.now()+1000*60*60*24*3}} )
     */
    void addPermission(String user, String key, String permission, JsonObject attributes);

    /**
     * Добавление сразу группы разрешений. Работает как {@link #addPermission}, только все разрешения задаются в одном аргументе.
     *
     * @param user        пользовател
     * @param key         ключ разрешений, если не задан, то генерируется уникальный
     * @param permissions JSON, где ключ соответствует идентификатору или префиксу идентификатора разрешения, а значение дополнительным атрибутам
     */
    void addPermissions(String user, String key, JsonObject permissions);

    /**
     * Удаляет разрешения
     *
     * @param key        ключ разрешений, если не задан, то для всех ключей пользователя
     * @param permission префикс разрешений для удаления, если не задан то удаляются все разрешения для соотв ключа
     * @return кол-во удаленных разрешений
     */
    int removePermissions(String user, String key, String permission);
}
