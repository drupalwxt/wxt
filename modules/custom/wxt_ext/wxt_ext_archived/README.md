## wxt_ext_archived

### Description

This module creates a GCWEB standard 'archived' alert block to be triggered by a checkbox field on a content-type. The point
of this feature is to avoid adding this alert block into the node body where it cannot be managed globally. This module
also defines the archived field for the content-type(s) to use (field_archived).

### Installation

The steps to enable this feature are:

1. enable module
2. migrate archived block content
3. migrate archived block translation
4. add (existing) archived field (field_archived) to content-type
5. remove the field from being displayed on the content-type
6. place archived field on content-type using manage form display
7. in block layouts add block to Content region above Main page content
8. set visibility condition on archived block 'Archived is checked' (flush plugin cache if condition is not avialable)

### Support

Please raise all issues to https://www.drupal.org/project/issues/wxt
