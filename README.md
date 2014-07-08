# Sightly TodoMVC Example

This example shows how to build components in AEM 6 with Sightly. It's a feature-complete implementation of the famous [TodoMVC](http://todomvc.com) exercise, which is traditionally meant for client-side JavaScript frameworks. This implementation though shows how such an application can easily be built in AEM and it's status persisted on the server using the Apache Sling REST framework.

## Learning Sightly

Sightly is the new HTML templating system, introduced with AEM 6.0. It takes the place of JSP (Java Server Pages) and ESP (ECMAScript Server Pages) as the preferred HTML templating system for AEM.

The [Sightly Documentation on the AEM Site](http://docs.adobe.com/docs/en/aem/6-0/develop/sightly.html) is a great resource for getting started.

Get help from other Sightly users:

* [Sightly](https://twitter.com/sightlyio)
* [Gabriel](https://twitter.com/gabrielwalt)
* [Senol](https://twitter.com/thelabertasch)

If you are interested to learn how we came up with Sightly, check out the [Behind the Scenes Youtube channel](https://www.youtube.com/playlist?list=PLkBe8kbE_7-xeo5uNJVE4uZXRpOpCA0J8).

## Implementation

The server sets a number of data attributes to the HTML elements that are interactive. These data attributes are instructing the app front-end about the asynchronous POST requests that are to be done when interacting with these elements, in order to persist the manipulations to the server. After each manipulation, the app content is reloaded through an asynchronous query to retreive the HTML fragment of the view that must be updated.

Beyond the classic MVC, this architecture also has following particularities:

* The [Sling Post Servlet](http://sling.apache.org/documentation/bundles/manipulating-content-the-slingpostservlet-servlets-post.html) makes it possible that no code has to be written to handle the POST requests.
* Through the data attributes set by the server, the client needs no knowledge of how to structure the data for the Sling Post Servlet.
* To retreive the HTML fragment of what must be updated on the page, a simple `todoapp` [selector](http://sling.apache.org/documentation/the-sling-engine/url-decomposition.html) allows to trigger the specific template that handles that part of the view.
* The filters (to show all, or only active or completed items) use an additional selector, which allows the server to know which items to render.

Note that [Java](http://docs.adobe.com/docs/en/aem/6-0/develop/sightly/use-api-in-java.html) could also have been used instead of the server-side JavaScript files.

#### Content

The nodes located in the content repository at `/content/todo` are serialized in a [`.content.xml`](app/jcr_root/content/todo/.content.xml) file with following content:

* [`jcr:content`](app/jcr_root/content/todo/.content.xml#L4-L15) The content node for the todo page. It contains the title and various labels that are to be displayed on the page, but important is the `sling:resourceType` property, which makes this node rendered by the [`page`](app/jcr_root/apps/todo/components/page) component.
  * [`todo_<N>`](app/jcr_root/content/todo/.content.xml#L16-L20) The todo items with their titles and completed status. As the `sling:resourceType` property defines it, they are rendered by the [`item`](app/jcr_root/apps/todo/components/item) component.

#### Server-side components

[AEM components](http://dev.day.com/docs/en/cq/current/developing/components.html) render individual content nodes based on their `sling:resourceType` properties.

* [`page`](app/jcr_root/apps/todo/components/page)
  Renders the page content node.
  * [`page.html`](app/jcr_root/apps/todo/components/page/page.html)
    **Entry point:** The outer page markup that doesn't change when actions are performed.
  * [`page.js`](app/jcr_root/apps/todo/components/page/page.js)
    Server-side script that prepares the data model needed by `page.html`.
  * [`todoapp.html`](app/jcr_root/apps/todo/components/page/todoapp.html)
    Renders the list of todo items. **Called** directly when fetching what changed in the view.
  * [`todoapp.js`](app/jcr_root/apps/todo/components/page/todoapp.js)
    Server-side script that prepares the data model needed by `todoapp.html`; also defines the data attributes that will instruct the front-end POST requests.
* [`item`](app/jcr_root/apps/todo/components/item)
  Renders the todo item content nodes.
  * [`item.html`](app/jcr_root/apps/todo/components/item/item.html)
    Renders the markup for the items.
  * [`item.js`](app/jcr_root/apps/todo/components/item/item.js)
    Server-side script that prepares the data model needed by `item.html`; also defines the data attributes that will instruct the front-end POST requests.
* [`utils`](app/jcr_root/apps/todo/components/utils)
  Collection of reusable scripts.
  * [`filters.js`](app/jcr_root/apps/todo/components/utils/filters.js)
    Defines what filters are set depending on the request selectors (i.e. to show all, or only active or completed items).

#### Client-side libraries

[Client libraries](http://dev.day.com/docs/en/cq/current/developing/clientlibs.html) can conveniently combine and minimize multiple CSS and JS files:

* [`clientlib`](app/jcr_root/etc/designs/todo/clientlib)
  * [`css.txt`](app/jcr_root/etc/designs/todo/clientlib/css.txt)
    Lists the oder in which to load the CSS files.
  * [`js.txt`](app/jcr_root/etc/designs/todo/clientlib/js.txt)
    Lists the oder in which to load the JS files.
  * [`css`](app/jcr_root/etc/designs/todo/clientlib/css)
    * [`base.css`](app/jcr_root/etc/designs/todo/clientlib/css/base.css)
      The style base provided by the [TodoMVC template](https://github.com/tastejs/todomvc/tree/gh-pages/template).
  * [`js`](app/jcr_root/etc/designs/todo/clientlib/js)
    * [`jquery.js`](app/jcr_root/etc/designs/todo/clientlib/js/jquery.js)
      For convenience of writing concise JS...
    * [`app.js`](app/jcr_root/etc/designs/todo/clientlib/js/app.js)
      Implementation of all the **web app interactions**.

## Running it

* **Create package**
  * Create a ZIP file from the `apps` folder, for e.g. in a Unix shell you can do:  
    `cd apps`  
    `zip TodoMVC.zip -r jcr_root META-INF`
* **Start AEM**
  * Double-click on the AEM JAR to start an instance if you haven't done that already.
  * Once you're prompted with a login in your browser, enter `admin` as username and password.
* **Install package**
  * Goto the [AEM Package Manager](http://localhost:4502/crx/packmgr/index.jsp).
  * Click on `Upload package` and browse for your ZIP file, then hit `OK`.
  * Once `TodoMVC.zip` shows up at the top of the list, click on `Install` => `Install`.
* **Run the app**
  * Access the [Todo](http://localhost:4502/content/todo.html) page.
