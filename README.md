# SAP S/4HANA Cloud Extensions - Deploy SAP Cloud Platform Fiori App to SAP S/4HANA Cloud
This simple Fiori UI sample application showcases an extension to an SAP S/4HANA Cloud system. It lists the actual stock movement information (from a custom CDS view) with extended material information (from a custom field).<br/> This very simple app is to be seen in the context of the overall scenario which takes up several focal extensibility topics. The scenario is rather to show how you can do in-app extensions on SAP S/4HANA Cloud, expose a service from a Custom CDS view and consume this service in a custom SAP Fiori UI on SAP Cloud Platform. Furthermore, the scenario includes the topic of deploying the custom UI from SAP Cloud Platform to SAP S/4HANA Cloud as well as a description on transporting extensions from a quality to a productive system. 

Requirements
-------------
- An account in SAP Cloud Platform with a subaccount in the Neo environment and SAP Web IDE Full Stack enabled.
- A licensed productive SAP S/4HANA Cloud tenant.

Set-up Instructions Guide
-------------
To implement this sample app in your own landscape, you need to do some preparation steps. These steps are outlined in the [set-up instructions guide](https://help.sap.com/viewer/841f379acd104dbf8685b3ad26e66af3/SHIP/en-US). There, you will find more details on the end to end steps, e.g.:
* Creation of a custom field in SAP S/4HANA Cloud
* Connection setup of the SAP S/4HANA Cloud system and SAP Cloud Platform (via a communication arrangement)
* Deployment of the sample app
* Integration of the custom app on the S/4HANA Cloud Launchpad
* Transportation of the custom UI and extenstions from a quality to a productive SAP S/4HANA Cloud system

Known issues
---------------------
There are no known major issues.

How to obtain support
---------------------
If you have issues with this sample, please open a report using [GitHub issues](https://github.com/SAP/s4hana-ext-deploy-custom-ui/issues).

License
-------
Copyright © 2019 SAP SE or an SAP affiliate company. All rights reserved.
This file is licensed under the SAP Sample Code License except as noted otherwise in the [LICENSE file](LICENSE).
