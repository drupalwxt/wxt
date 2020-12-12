## Varnish

To properly configure Varnish with Drupal you should ensure the following configuration is your `default.vcl` file.

> Note: Some customizations might be necessary depending on your individual requirements.

```vcl
vcl 4.0;

import std;
import directors;

backend nginx {
  .host = "hostname-nginx";
  .host_header = "hostname-nginx";
  .port = "80";
}

sub vcl_init {
  new backends = directors.round_robin();
  backends.add_backend(nginx);
}

sub vcl_recv {
  set req.http.X-Forwarded-Host = req.http.Host;
  if (!req.http.X-Forwarded-Proto) {
    set req.http.X-Forwarded-Proto = "http";
  }

  # Answer healthcheck
  if (req.url == "/_healthcheck" || req.url == "/healthcheck.txt") {
    return (synth(700, "HEALTHCHECK"));
  }
  set req.backend_hint = backends.backend();

  # Answer healthcheck
  if (req.url == "/_healthcheck" || req.url == "/healthcheck.txt") {
    return (synth(700, "HEALTHCHECK"));
  }
  set req.backend_hint = backends.backend();

  # Always cache certain file types
  # Remove cookies that Drupal doesn't care about
  if (req.url ~ "(?i)\.(asc|dat|tgz|png|gif|jpeg|jpg|ico|swf|css|js)(\?.*)?$") {
    unset req.http.Cookie;
  } else if (req.http.Cookie) {
    set req.http.Cookie = ";" + req.http.Cookie;
    set req.http.Cookie = regsuball(req.http.Cookie, "; +", ";");
    set req.http.Cookie = regsuball(req.http.Cookie, ";(SESS[a-z0-9]+|SSESS[a-z0-9]+|NO_CACHE)=", "; \1=");
    set req.http.Cookie = regsuball(req.http.Cookie, ";[^ ][^;]*", "");
    set req.http.Cookie = regsuball(req.http.Cookie, "^[; ]+|[; ]+$", "");
    if (req.http.Cookie == "") {
        unset req.http.Cookie;
    } else {
        return (pass);
    }
  }
  # If POST, PUT or DELETE, then don't cache
  if (req.method == "POST" || req.method == "PUT" || req.method == "DELETE") {
    return (pass);
  }
  # Happens before we check if we have this in cache already.
  #
  # Typically you clean up the request here, removing cookies you don't need,
  # rewriting the request, etc.
  return (hash);
  #return (pass);
}

sub vcl_backend_fetch {
  # NEW
  set bereq.http.Host = "hostname-nginx";

  # Don't add 127.0.0.1 to X-Forwarded-For
  set bereq.http.X-Forwarded-For = regsub(bereq.http.X-Forwarded-For, "(, )?127\.0\.0\.1$", "");
}

sub vcl_backend_response {
  if (beresp.http.Location) {
    set beresp.http.Location = regsub(
      beresp.http.Location,
      "^https?://[^/]+/",
      bereq.http.X-Forwarded-Proto + "://" + bereq.http.X-Forwarded-Host + "/"
    );
  }
  # Only cache select response codes
  if (beresp.status == 200 || beresp.status == 203 || beresp.status == 204 || beresp.status == 206 || beresp.status == 300 || beresp.status == 301 || beresp.status == 404 || beresp.status == 405 || beresp.status == 410 || beresp.status == 414 || beresp.status == 501) {
    # Cache for 5 minutes
    set beresp.ttl = 5m;
    set beresp.grace = 12h;
    set beresp.keep = 24h;
  } else {
    set beresp.ttl = 0s;
  }
}

sub vcl_deliver {
  # Remove identifying information
  unset resp.http.Server;
  unset resp.http.X-Powered-By;
  unset resp.http.X-Varnish;
  unset resp.http.Via;

  # Add Content-Security-Policy
  # set resp.http.Content-Security-Policy = "default-src 'self' *.example.ca *.example.ca; style-src 'self' 'unsafe-inline' *.example.ca https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.example.ca  *.adobedtm.com use.fontawesome.com blob:; connect-src 'self' *.example.ca *.omtrdc.net *.demdex.net *.everesttech.net; img-src 'self' *.example.ca *.omtrdc.net *.demdex.net *.everesttech.net data:; font-src 'self' *.example.ca https://fonts.gstatic.com";

  # Add CORS Headers
  # if (req.http.Origin ~ "(?i)\.example\.ca$") {
  #   if (req.url ~ "\.(ttd|woff|woff2)(\?.*)?$") {
  #     set resp.http.Access-Control-Allow-Origin = "*";
  #     set resp.http.Access-Control-Allow-Methods = "GET";
  #   }
  # }

  # Add X-Frame-Options
  if (req.url ~ "^/livechat" || req.url ~ "^/(eng/|fra/)?media/") {
    set resp.http.X-Frame-Options = "SAMEORIGIN";
  } else {
    set resp.http.X-Frame-Options = "DENY";
  }

  set resp.http.X-Content-Type-Options = "nosniff";
  set resp.http.X-XSS-Protection = "1; mode=block";

  # Happens when we have all the pieces we need, and are about to send the
  # response to the client.
  #
  # You can do accounting or modifying the final object here.
  if (obj.hits > 0) {
    set resp.http.X-Cache = "HIT";
  } else {
    set resp.http.X-Cache = "MISS";
  }
  # Handle errors
  if ( (resp.status >= 500 && resp.status <= 599)
    || resp.status == 400
    || resp.status == 401
    || resp.status == 403
    || resp.status == 404) {
    return (synth(resp.status));
  }
}

sub vcl_synth {
  # Remove identifying information
  unset resp.http.Server;
  unset resp.http.X-Powered-By;
  unset resp.http.X-Varnish;
  unset resp.http.Via;

  # Add Content-Security-Policy
  # set resp.http.Content-Security-Policy = "default-src 'self' *.example.ca; style-src 'self' 'unsafe-inline' *.example.ca; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.example.ca *.adobedtm.com use.fontawesome.com blob:; connect-src 'self' *.example.ca *.omtrdc.net *.demdex.net *.everesttech.net; img-src 'self' *.example.ca data:;";
  # set resp.http.X-Content-Type-Options = "nosniff";
  # set resp.http.X-Frame-Options = "DENY";
  # set resp.http.X-XSS-Protection = "1; mode=block";

  # if (resp.status >= 500 && resp.status <= 599) {
  #   set resp.http.Content-Type = "text/html; charset=utf-8";
  #   synthetic(std.fileread("/data/configuration/varnish/errors/503.html"));
  #   return (deliver);
  # } elseif (resp.status == 400) { # 400 - Bad Request
  #   set resp.http.Content-Type = "text/html; charset=utf-8";
  #   synthetic(std.fileread("/data/configuration/varnish/errors/400.html"));
  #   return (deliver);
  # } elseif (resp.status == 401) { # 401 - Unauthorized
  #   set resp.http.Content-Type = "text/html; charset=utf-8";
  #   synthetic(std.fileread("/data/configuration/varnish/errors/401.html"));
  #   return (deliver);
  # } elseif (resp.status == 403) { # 403 - Forbidden
  #   set resp.http.Content-Type = "text/html; charset=utf-8";
  #   synthetic(std.fileread("/data/configuration/varnish/errors/403.html"));
  #   return (deliver);
  # } elseif (resp.status == 404) { # 404 - Not Found
  #   set resp.http.Content-Type = "text/html; charset=utf-8";
  #   synthetic(std.fileread("/data/configuration/varnish/errors/404.html"));
  #   return (deliver);
  # } else

  if (resp.status == 700) { # Respond to healthcheck
    set resp.status = 200;
    set resp.http.Content-Type = "text/plain";
    synthetic ( {"OK"} );
    return (deliver);
  }
}

##
# ERROR HANDLING
##
# sub vcl_backend_error {
#   set beresp.http.Content-Type = "text/html; charset=utf-8";
#   synthetic(std.fileread("/data/configuration/varnish/errors/503.html"));
#   return (deliver);
# }
```
