@wxt @workflow @api @diff
Feature: Diffing different revisions of content

  Scenario: Diffing two node revisions
    Given I am logged in as a user with the administrator role
    And page content:
      | title       | body           | moderation_state |
      | Drupal 8    | First revision | draft            |
    When I visit "/drupal-8"
    And I visit the edit form
    And I enter "Second revision" for "body[0][value]"
    And I press "Save"
    And I visit the edit form
    And I enter "Third revision" for "body[0][value]"
    And I press "Save"
    And I compare the 1st and 2nd revisions
    Then I should see "Changes to Drupal 8"
