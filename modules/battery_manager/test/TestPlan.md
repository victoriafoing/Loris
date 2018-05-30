## Battery Manager Module Test Plan

### 📄 Overview

Battery Manager module allows users to search for, add, and delete entries in the
Test Battery

### 🔒 Permissions 

In order to use the Battery Manager module the user might need one or both of the following permissions:

1. **battery_manager_view** - gives user read-only access to Battery Manager module
(browse entries in Test Battey)
2. **battery_manager_edit** - gives user edit access to Battery Manager module
(edit/remove entries in Test Battery)

>**Note**: superusers have both of the aforementioned permissions by default! 💪

### 💯 Features

1. **Browse** entries in the Test Battery
2. **Add** new entry to the Test Battery database
  - Instrument, Active, Stage, and Subproject are required fields
3. **Remove** entry from the Test Battery database

---

### 💻 Testing Procedure

**Install Module** 
  1. Run associated SQL patches to update permissions and LorisMenu tables.


**Testing with no permissions** [Automation Testing]
  1. Access the module with a regular user (without superuser permissions)
  2. By default, the access to module should be denied


**Testing with view permission** [Automation Testing]
  1. Add view permission to the aforementioned user
  2. Battery Manager module should be accessible and only present with **one** tab (Browse) with an empty datatable

**Testing with edit permission** [Automation Testing]
  1. Add edit permission
  2. Battery Manager module should now have **two** tabs (Browse) and (Add)
  3. Clicking on Add tab should hide the data table and display a form with the following fields:
     Instrument, Minimum age, Maximum age, Active, Stage, Subproject, Visit Label, Site, First Visit,
     and Instrument Order

**Testing add functionality**
  1. Click on the 👉 **Add** button
    - A popup should prompt you to select an **Instrument** as it is a required field ❌
  2. Select Instrument and click on 👉  **Add** again
    - A popup should prompt you to select **Active** as it is a required field ❌
  3. Select Active and click on 👉  **Add** again
    - A popup should prompt you to select a **Stage** as it is a required field ❌
  4. Select Stage and click on 👉  **Add** again
    - A popup should prompt you to select a **Subproject** as it is a required field ❌
  5. Click on **Add** one more time
  6. Once the entry has been inserted into the Test Battery database a success message
     should appear on top of the page and fade away in a couple of seconds
  7. Click on browse tab and make sure the entry you just added is shown in data table

**Testing browse functionality**
  1. After a couple of entries are added, make sure they are properly displayed in the data table
  2. Make sure that information in the data table corresponds to the information in the database (Test Battery table)
  3. Click on 👉  **column headers** to make sure sorting functionality is working as expected (Ascending/Descending)

**Testing remove functionality**
  1. Press "X" in **Remove** column on an entry in the data table to remove it from the database
  2. Refresh the **Browse** tab and search for the entry you just deleted
    - The Select Filter should not return any results for that entry

**Test filters**
  1. Under **Browse** tab, a selection filter should be present on top of the page containing the following fields:
Instrument, Minimum age, Maximum age, Active, Stage, Subproject, Visit Label, Site, First Visit.
    - Minimum age and Maximum age are text fields
    - Other fields are dropdowns with options pre-filled based on the current project.
    - Default option of dropdown should be blank.
  2. Type text in the Minimum age and verify that the table gets filtered as you type.
  3. Type text in the Maximum age and verify that the table gets filtered as you type.
  5. Select values from the dropdown filters (independently and combined) to filter table further
    - The table should update and display filtered records accordingly
