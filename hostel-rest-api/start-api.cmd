@echo off
SET JAVA_HOME=D:\jdk
SET RMI_CLASSES=D:\flutter_projects\hostel-rmi-system

"%JAVA_HOME%\bin\java" -cp "target\classes;%RMI_CLASSES%;target\hostel-rest-api-0.0.1-SNAPSHOT.jar" -Dloader.path="%RMI_CLASSES%" -Djava.rmi.server.useCodebaseOnly=false org.springframework.boot.loader.launch.JarLauncher