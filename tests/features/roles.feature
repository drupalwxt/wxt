@wxt @core @api
Feature: User roles and related config

  Scenario: Administrator Role select list should be present in Account Settings
    Given I am logged in as a user with the administrator role
    When I visit "/admin/people/role-settings"
    Then I should see "This role will be automatically granted all permissions."
