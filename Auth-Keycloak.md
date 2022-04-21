# Настройка авторизации через Keycloak


## Настройки проекта

**1.** Подключить в проект библиотеки и пересобрать сборку

```
        <dependency>
            <groupId>org.keycloak</groupId>
            <artifactId>keycloak-servlet-filter-adapter</artifactId>
            <version>15.0.1</version>
        </dependency>
```

## Настройка Keycloak

**1.** Установить Keycloak, настроить сервис на запуск bin/standalone.sh

**2.** Зайти на http://localhost:8080/auth и задать пароль администратора (8080 доступен только для локальной машиши, так что проще пробросить, например ssh -L 8080:127.0.0.1:8080 cb@test.cubisio.ru)

**3.** Создать клиента (тот, что запрашивает аутентификацию)

http://localhost:8080/auth/admin/master/console/#/realms/master/clients
Client ID = cubisio
Access Type = Confidential
Root URL = http://localhost:8888
Valid Redirect URIs += *

**4.** Зайти в Credentials созданного клиента и скопировать Secret (затем его надо будет вставить в keycloak.json)

**5.** Чтобы имя пользователя у Principal было оригинальным вместо внутреннего id - Зайти в Mappers созданного клиента и нажать "Add Builtin", найти и добавить username. В keycloak.json должно быть задано `"principal-attribute":"preferred_username"`.

## Настройки приложения

**1.** В web.xml добавить filter или взять keycloak.web.xml

keycloak.config.skipPattern задает пути, которые будут доступны без аутентификации.

```
    <filter>
        <filter-name>KeycloakFilter</filter-name>
        <filter-class>org.keycloak.adapters.servlet.KeycloakOIDCFilter</filter-class>
        <init-param>
            <param-name>keycloak.config.path</param-name>
            <param-value>/WEB-INF/keycloak.json</param-value>
        </init-param>
        <init-param>
            <!-- public resources -->
            <param-name>keycloak.config.skipPattern</param-name>
            <param-value>(?i)^/(DataCube/Query/JcqHtml.jsb|jsbeans.jsb|dashboard.jsb|download.jsb|workspace/DownloadEntry.jsb|workspace/DownloadEntry.jsb|workspace/DownloadEntry.jsb)</param-value>
        </init-param>
        <async-supported>true</async-supported>
    </filter>

```

и filter-mapping

```
    <filter-mapping>
        <filter-name>KeycloakFilter</filter-name>
        <servlet-name>JsbServlet</servlet-name>
        <servlet-name>HttpJsbServlet</servlet-name>
        <servlet-name>JSEndPointServlet</servlet-name>
    </filter-mapping>
```

**2.** Создать WEB-INF/keycloak.json и вставить secret из настроек клиента
 
```
{
    "realm": "master",
    "resource": "cubisio",
    "auth-server-url": "http://localhost:8080/auth",
    "ssl-required" : "external",
    "credentials": {
        "secret": "YOUR CLIENT SECRET"
    },
    "principal-attribute":"preferred_username"
}
```

При текущих настройках всё будет работать после авторизации.

## Настройка https

**1.** Добавить в nginx прокси для keycloak auth

```
    location /auth/ {
        proxy_pass          http://127.0.0.1:8080/auth/;
        proxy_buffering off;
        proxy_redirect off;
        proxy_set_header Referer $http_referer;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header Host $http_host;
    }

```

**2.** Установить Cerbot и накатить на nginx.

**3.** В конфиге keycloak standalone.xml или standalone-ha.xml добавить `proxy-address-forwarding="true"` в <server>/<http-listener>, чтобы не было ошибки подмены протокола

**4.** Заменить URL в WEB-INF/keycloak.json

```
"auth-server-url": "http://test.cubisio.ru/auth"
```

## Кастомная форма логина

https://www.baeldung.com/keycloak-custom-login-page


## Примечания

для Logout вызвать https://test.cubisio.ru/auth/realms/master/protocol/openid-connect/logout?redirect_uri=

