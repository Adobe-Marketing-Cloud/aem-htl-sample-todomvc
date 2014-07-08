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

* `jcr:content`: The content node for the todo page. It contains the title and various labels that are to be displayed on the page, but important is the `sling:resourceType` property, which makes this node rendered by the [`page`](app/jcr_root/apps/todo/components/page) component.
  * `todo_<N>`: The todo items with their title and completed status. As the `sling:resourceType` property defines it, they are rendered by the [`item`](app/jcr_root/apps/todo/components/item) component.

#### Server-side components

* [`page`](app/jcr_root/apps/todo/components/page): Renders the page content node (like `/content/todo/jcr:content`).
  * [`page.html`](app/jcr_root/apps/todo/components/page/page.html): Entry point: The outer page markup that doesn't change when actions are performed.
  * [`page.js`](app/jcr_root/apps/todo/components/page/page.js): Server-side JavaScript that prepares the data model needed by `page.html`.
  * [`todoapp.html`](app/jcr_root/apps/todo/components/page/todoapp.html): Renders the list of todo items - this template gets directly called when fetching the HTML fragment of what changed in the view.
  * [`todoapp.js`](app/jcr_root/apps/todo/components/page/todoapp.js): Server-side JavaScript that prepares the data model needed by `todoapp.html`.
    The returned obect is of the form `{ count: 0, active: 0, completed: 0 }`
* [`item`](app/jcr_root/apps/todo/components/item): Renders the todo item content nodes (like `/content/todo/jcr:content/todo_1`).
  * [`item.html`](app/jcr_root/apps/todo/components/item/item.html): Renders the markup for the item.
  * `item.js`: Server-side JavaScript that prepares the data model needed by `item.html`.
* [`utils`](app/jcr_root/apps/todo/components/utils): Scripts that are needed by multiple components.
  * [`filters.js`](app/jcr_root/apps/todo/components/utils/filters.js): Server-side JavaScript that defines what filters are set depending on the request selectors (i.e. to show all, or only active or completed items).

#### Client-side libraries

[Client libraries](http://dev.day.com/docs/en/cq/current/developing/clientlibs.html) can conveniently combine and minimize multiple CSS and JS files:

* [`clientlib`](app/jcr_root/etc/designs/todo/clientlib)
  * [`css.txt`](app/jcr_root/etc/designs/todo/clientlib/css.txt): Lists the oder in which to load the CSS files.
  * `css`
    * [`base.css`](app/jcr_root/etc/designs/todo/clientlib/css/base.css): The style base provided by the [TodoMVC template](https://github.com/tastejs/todomvc/tree/gh-pages/template).
  * [`js.txt`](app/jcr_root/etc/designs/todo/clientlib/js.txt): Lists the oder in which to load the JS files.
  * `js`
    * [`jquery.js`](app/jcr_root/etc/designs/todo/clientlib/js/jquery.js): [jQuery](http://jquery.com/) for convenience of writing concise JS in `app.js`.
    * [`app.js`](app/jcr_root/etc/designs/todo/clientlib/js/app.js): The actual implementation of all the actions that happen when interacting with the web app.

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
