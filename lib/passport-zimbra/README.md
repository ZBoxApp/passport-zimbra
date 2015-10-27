### Como hacer el Post del XML
En el archivo `auth.xml` se tienen que reemplazar las siguientes variables:

* `@account`, dirección de correo que se debe autenticar
* `@auth_token`, token que se usa para autenticar la cuenta

Este XML se debe enviar con un POST y con el Header `Content-Type: text/xml` a la siguiente URL del Webmail:

```
 # Produccion
 https://mail.zboxapp.com/service/soap/AuthRequest

 # Desarrollo
 https://localhost:7443/service/soap/AuthRequest
```

Un ejemplo usando `curl`:

```bash
$ curl -k --header "Content-Type: text/xml" --data @soap_auth.xml https://localhost:7443/service/soap/AuthRequest
```
El archivo `soap_auth.xml` contiene la solicitud en `XML`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <context xmlns="urn:zimbra">
      <authToken>0_08a490b4a8edddbcd1f355970965c01288fd015a_69643d33363a33636264303962362d363061342d343333342d623135392d3633616464653563383938653b6578703d31333a313434363132393234363636313b747970653d363a7a696d6272613b7469643d393a3232373736333833373b76657273696f6e3d31333a382e362e305f47415f313135333b</authToken>
      <account by="name">admin@zboxapp.dev</account>
      <userAgent name="zclient" version="8.6.0_GA_1153"/>
    </context>
  </soap:Header>
  <soap:Body>
    <GetInfoRequest rights="" sections="attrs" xmlns="urn:zimbraAccount"/>
  </soap:Body>
</soap:Envelope>
```

### Como obtener un Token de prueba
En la máquina de desarrollo de Zimbra, ejecuta el siguiente comando como usuario `zimbra`:

```bash
[zimbra@zimbra ~]$ zmmailbox -d -m admin@zboxapp.dev -p12345678 gaf | grep authToken | sort -u
<authToken>0_15a3f6fde258d4e655eb546ba409dc938bba6078_69643d33363a33636264303962362d363061342d343333342d623135392d3633616464653563383938653b6578703d31333a313434363133313738383939333b747970653d363a7a696d6272613b7469643d393a3938303833393834313b76657273696f6e3d31333a382e362e305f47415f313135333b</authToken>
[zimbra@zimbra ~]$
```

Puedes obtener un listado de los usuarios creados para probar con:

```bash
[zimbra@zimbra ~]$ zmprov -l gaa
domain_admin@customer.dev
admin_orphan@customer.dev
1@customer.dev
pdpdp@customer.dev
unknow_cos_1@customer.dev
unknow_cos_2@customer.dev
cos_premium_1@customer.dev
cos_basic_1@customer.dev
...
```

Y finalmente puedes cambiar la contraseña de algún usuario con:

```bash
[zimbra@zimbra ~]$ zmprov sp user2@customer1.dev newPassword
```
