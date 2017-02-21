@wxt @api
Feature: WxT Roles
  Makes sure that the roles are configurable.

  Scenario: Ensure the roles configuration form works
    Given I am logged in as a user with the administrator role
    When I visit "/admin/config/system/lightning"
    And I uncheck the box "content_roles[reviewer]"
    And I press "Save configuration"
    Then the response status code should be 200
    And I check the box "content_roles[reviewer]"
    And I press "Save configuration"
