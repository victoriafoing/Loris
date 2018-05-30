# Battery Manager

## Purpose

The Battery Manager module allows users to **add** and **remove** entries 
in the Test Battery. 

## Intended Users

The Battery Manager module is used by study administrators

## Scope

The Battery Manager module provides a tool for adding and removing entries in the
the Test Battery.
The *add* functionality is in a separate page in the Battery Manager module.
Users can add a database entry by navigating to this page and 
filling out the required fields.
The *remove* functionality is in the main page.
Users can remove a database entry by pressing 'x' on the row they want to remove 
in the menu table. 

## Permissions

In order to use the Battery Manager module the user needs one or both of the following 
permissions:

- `battery_manager_view`: gives user a read-only access to Battery Manager module 
(browsing the Test Battery)
- `battery_manager_edit`: gives user a edit access to Battery Manager module 
(add/remove entries in Test Battery)
