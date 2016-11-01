# router project
Router.js is a simple yet powerful javascript plugin to handle hash fragment in order to route request.
Router.js helps you to intercept request done trough fragment and match them using string or regular expressions.

Migrating from 0.x to 1.x

If you have code for version prior of 1.0.0 you should remember that something has changed.
To be sure that another matching route exists, you have to check req.hasNext and not controlling that next is a function, as previous indicated.
Here an exemple of migration

router.get('#/home',function(erq, next){
//Avoid
if(next instanceof Function){ // WRONG! It's always a function now
next();
}

//Use instead
if(req.hasNext){
next();
}
});
Basics

Include Router.js in your application

Standard

<script src="js/router.js" type="text/javascript">// <![CDATA[

RequireJS

//Example
require(["router", ...], function(Router, ...) {
    var router = new Router();
    //...
});
according to your directory template.

Now just define a simple route. A route is made of two components

Matching string/regexp
Callback
Let’s see

var router = new Router()
    .addRoute('#/users', function(req, next){
        /* Do something */
    });
There are three noticeble aspects. Your router object and all its functions are chainable. So after an addRoute you can chain onther one and so on.
The matching string is #/users, so if your fragment match this pattern your callback will be fired.

Callback is populated with two arguments:

req
next
req is an object containing

href, which is the url that matched
params, all the params recognized in the url. We will talk about this in a while
query, all the params passed as regular html query string
splats, all matching groups if you used a regular expression as route description (will see after)
hasNext, a boolean indicating that another route match the current url
What if more than a route match your url? You can call next to execute the next route.

Note:

Method `addRoute` has many aliases. You can use also: `add`, `route`, `get`!
Options

Router constructor accept an object for options

var options = {ignorecase: true}
var router = new Router(options);
Valid options:

ignorecase : The router do not consider casing. Default: true
Parametric route

Let’s see this:

router
    .addRoute('#/users/:username', function(req,next){
        var username = req.params.username;
    });
well, if the called url is ‘http://www.webapp.com/#/users/john’, then username in the callback will be ‘john’!

You can use as many params you want, they will appear in the params property of req object.

Query string

Using previous example if we call ‘http://www.webapp.com/#/users/jhon?key=value&foo=bar’ then in req query will be populated and will be the following object

...
query: {
    key: 'value',
    foo: 'bar'
}
so you can write

router
    .addRoute('#/users/:username', function(req,next){
        var foo = (req.query && req.query.foo) ? req.query.foo : 'not foo';
    });
Req.get – One method to get them all

Instead of looking in req.params and in req.query, you can use req.get( key, default_value ) method.
It will look in params, the in query. If nothing has found you can provide a fallback value or undefined will be returned.

//Calling #/users/john?age=25
router
    .addRoute('#/users/:username', function(req,next){
        var username = req.get('username'); //will be 'john' because is found in params
        var age = req.get('age',18); //will be 25 because is found in query
        var surname = req.get('surname','Snow'); //will be 'Snow' because of provided default value
        var address = req.get('address'); //will be undefined
    });
Special symbols

The other symbol you can use in your route is *. It matches every word before next backslash.
Consider:

router
    .addRoute('#/users/*', function(req,next){
        /* First word after /users/ will match this route */
    });
Now all of this url will match the rule:

http://www.webapp.com/#/users/john
http://www.webapp.com/#/users/asdasd
http://www.webapp.com/#/users/lua
The url http://www.webapp.com/#/users/john/foo will not match! Remember that I’ve said before next backslash!
To match even it you must use the ** matcher. It means everything

router
    .addRoute('#/users/**', function(req,next){
        /* Everithing after /users/ will match this route */
    });
All of this urls match the rule:

http://www.webapp.com/#/users/john
http://www.webapp.com/#/users/john/snow
http://www.webapp.com/#/users/john/snow/wolf
Next argument

Considering this routes:

router
    .addRoute('#/users/:username', function(req,next){
            var username = req.params.username;
            if( username != 'admin' && req.hasNext)
                next();

    })
    .addRoute('#/users/*', function(req,next){
        alert('You are not admin!');
    });
As you can see both the routes match the url http://www.webapp.com/#/users/john. In Router.js only the first declared match will be called unless you explicitly
call next, then also the second match will be fired and so on.

Note: Remember to check req.hasNext to know if another route matched!

Next will be useful also to fire erros, we will see this in a while, after talking about error handling

Note:
Have you noticed that addRoute methods are chainable? So this is for every router methods!

Error handling

We can handle errors just like http protocol handle it, by http codes.
An example is better than million words

router
    .addRoute('#/users/:username', function(req,next){
        /*do something*/
    })
    .errors(404, function( err, href){
        alert('Page not found!' + href );
    });
In this example if we point browser to http://www.webapp.com/#/route/inexistent no route will match our url. Router.js will fire a ‘404’ error.
You can subscribe to 404 situations just with .errors(404, function(err,href){...})

Router will match for you 404 and 500 situation but will fire a general error for all http code you forgot to register.

To fire an error manually call next with an error parameter (and an optional errorCode).
next signature is: next( [ err, [err_code] ] )

router
    .addRoute('#/users/:username', function(req,next){
        if(something)
            next('Not found',404);
    })
    .errors(404, function( err, href){
        alert('Page not foud!' + href );
    });
Befores

Sometimes you just want to execute some actions before the route matches and then continue on regular matches. Then before is what you need.

router
    .before(function(req,next){
        if( userIsLogged() === true)
            next();
        else
            next( new Error('User not logged'), 403);
    })

    .addRoute('#/users/:username', function(req,next){
                        /*do something*/
    })

    .error(403, function(err, href){
        console.error('While attempting to access to '+ href +' the following error happened: '+err.message);
    });
Befores will be executed before normal route. If next is called in before then the route is followed, else if next is called with an error then the error is fired and the route is not followed.
You can specify even error type (403 in this case), elsewhere it will be a 500

You can add as many befores you want, they will be fired sequentially when you call next

router.before(function(){...})
      .before(function(){...});
Remember that in before req has just href property cause is the only you know at before time.

This meaning

Context inside callback, befores or errors have no special meaning to avoid complexity. If you need to force your context inside a callback you can use bind.
Bind is the browser implementation or our if missing. Let’s see at an example

function(){

    this.property = 'foo';

    var router = new Router()
                    .route('#/mine/route', function(req,next){
                            var p = this.property;
                            console.log(p); /* will print 'foo' */
                            router.redirect('#/'+p);
                    }.bind(this));

}
If you need your router inside a callback just refer to it as router.
Have you noticed redirect method? Well it’s time to talk about utility methods

Utility methods

In Router.js are present some utility methods.

redirect
router.redirect(url)
this will redirect your application to desired url firing routes normally

setLocation
router.setLocation(url)
this will redirect your application to desired url WITHOUT firing any routes!

play pause
router.pause();
document.location.href='/#/ignore/me'; //This will be ignored until you call play
router.play();
Pause stop router to react to hash changes. Play ripristinate router functionalities.

RegExp

We already said that you can use regular expression to better match your route

router.addRoute(/#/foo/bar/?(.*)/i, function(req, next){

    /* req gained splats property which contains an array with all your custom matches*/
});
So calling ‘http://www.webapp.com/#/foo/bar/custom’ will follow the route and in req you will find a property called splats.
Splats is an array containing all regexp matches (everyting between two ‘( )’ ). In this cas req.splats[0] is custom

You can use regular expression to obtain more grain fined routes but it’s up to you to handle them correctly

Run and Destroy

Router has a special method. You can call run after you have setted all your route to immediately launch routes parsing.
Run has a parameter, ‘startUrl’. If is setted it will redirect immediately to that url, else it will read current browser url.
If you do not call run Router will do nothing until next fragment change.

router
    .addRoute('#/users/:username', function(req, next){
      /* code */
    })
    .run('#/');
If you need to dispose a router, you have to call destroy to remove any event handler and then simply set router to null

router.destroy();
router = null;
//all clean
Api

You can generate documentation API of this repository using grunt doc.
A folder named doc will be generated and it will contain all the documentation.
Anyway the api are available online at routerjs.ramielcreations.com

Why

I’ve used different router like library but some do too few, other too much. I need a little, clear script which do the essential.
Code written using Router.js is higly readable

Compatibility

Desktop:

Chrome 5.0+
Firefox 3.6+
Safari 5.0+
Opera 10.6+
IE 8+
Mobile:
– iOS Safari 4.0+
– Android
– Browser 2.2+
– Chrome all
– Firefox all
– IE all
– Opera Mobile 11.0+

Author

