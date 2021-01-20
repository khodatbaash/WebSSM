# minimal-scalismo-seed
A minimal seed template for a [Scalismo](https://github.com/unibas-gravis/scalismo) build.

Once you have [sbt](http://www.scala-sbt.org/release/tutorial/Setup.html) installed, you can clone this project to build an application making use of Scalismo. A very simple example application is shown in [ExampleApp.scala](https://github.com/unibas-gravis/activator-scalismo-seed/blob/master/src/main/scala/com/example/ExampleApp.scala).

Once the project installed, you can also check the [quickstart](https://github.com/unibas-gravis/scalismo/wiki/quickstart) guide for a quick tour of Scalismo's capabilities.

### Compiling executable jars
To compile your application as an executable Jar, you can use the assembly command:
~~~
sbt assembly
~~~
This will dump an executable jar file in the target/scala-2.12/ directory. To run the jar:

~~~
java -jar target/scala-2.12/executable.jar
~~~

The name as well as the Main class to be used for the executable jar can be changed in the [build.sbt](https://github.com/unibas-gravis/minimal-scalismo-seed/blob/master/build.sbt) file
