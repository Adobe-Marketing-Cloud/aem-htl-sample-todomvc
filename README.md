# Sightly TodoMVC Example

This sample shows how to build components in AEM 6 with Sightly. It is an AEM implementation of the famous [TodoMVC Team](http://todomvc.com) exercise, which is traditionally meant for client-side JavaScript frameworks. This implementation though shows how such an application can easily be persisted on the server using AEM's underlying REST framework (Apache Sling).

## Learning Sightly

Sightly is the new HTML templating system, introduced with AEM 6.0. It takes the place of JSP (Java Server Pages) and ESP (ECMAScript Server Pages) as the preferred HTML templating system for AEM.

The [Sightly Documentation on the AEM Site](http://docs.adobe.com/docs/en/aem/6-0/develop/sightly.html) is a great resource for getting started.

Get help from other Framework Name users:

* [Sightly](https://twitter.com/sightlyio)
* [Senol](https://twitter.com/thelabertasch)
* [Gabriel](https://twitter.com/gabrielwalt)

If you are interested to learn how we came up with Sightly, check out the [Behind the Scenes Youtube channel](https://www.youtube.com/playlist?list=PLkBe8kbE_7-xeo5uNJVE4uZXRpOpCA0J8).

## Running it

* **Create package**
  * Create a ZIP file from the `apps` folder, for e.g. in a Unix shell you can do:
    * `cd apps`
    * `zip TodoMVC.zip -r jcr_root META-INF`
* **Start AEM**
  * Double-click on the AEM JAR to start an instance if you haven't done that already.
  * Once you're prompted with a login in your browser, enter `admin` as username and password.
* **Install package**
  * Goto the [AEM Package Manager](http://localhost:4502/crx/packmgr/index.jsp).
  * Click on `Upload package` and browse for your ZIP file, then hit `OK`.
  * Once `TodoMVC.zip` shows up at the top of the list, click on `Install` => `Install`.
* **Run the app**
  * Access the [Todo](http://localhost:4502/content/todo.html) page.

## Features

* **Implemented**
  * Create new item
  * Edit item
  * Delete item
  * Toggle item
* **Not yet implemented**
  * Clear completed items
  * Toggle all items
  * Select active or completed items

## Implementation

The way this web app works is that each action performed on the client triggers an asynchronous (ajax) POST to the server, which manipulates the server content accordingly thanks to the [SlingPostServlet](http://sling.apache.org/documentation/bundles/manipulating-content-the-slingpostservlet-servlets-post.html). The markup parts of the page that need to be updated are then retrieved again with a GET requests (this could later be optimized to do only one asynchronous request).

#### Server-side components
* **[Page](http://localhost:4502/crx/de/index.jsp#/apps/todo/components/page):** Renders the page
  * `page.html`: Entry point: The outer page markup that doesn't change when todo actions are performed.
  * `main.html`: The list of todo items - this is reloaded upon actions performed.
  * `footer.html`: The item counters displayed in the footer - this is reloaded upon actions performed.
  * `count.js`: Server-side JavaScript for `footer.html` that returns the number of completed and of active todo items.
* **[Item](http://localhost:4502/crx/de/index.jsp#/apps/todo/components/item):** Renders the todo item
  * `item.html`: Entry point: Contains the full markup for an item.

#### The client-side libraries
* **[Clientlib](http://localhost:4502/crx/de/index.jsp#/etc/designs/todo/clientlib):** [Client libraries](http://dev.day.com/docs/en/cq/current/developing/clientlibs.html) can conveniently combine and minimize the files.
  * **CSS**
    * `base.css`: The style base provided by the [TodoMVC template](https://github.com/tastejs/todomvc/tree/gh-pages/template).
    * `app.css`: The additional styles specific to this project.
  * **JavaScript**
    * `base.js`: The script base provided by the [TodoMVC template](https://github.com/tastejs/todomvc/tree/gh-pages/template).
    * `jquery.js`: [jQuery](http://jquery.com/) for convenience of writing concise JS in `app.js`.
    * `app.js`: The actual implementation of all the actions that happen when interacting with the web app.
