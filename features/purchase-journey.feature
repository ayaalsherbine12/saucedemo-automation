@e2e @saucedemo @purchase
Feature: SauceDemo purchase journey
  As a standard SauceDemo shopper
  I want to add products and complete checkout
  So that I can verify the end-to-end purchase flow

  Scenario: Complete purchase with fleece jacket and onesie
    Given I am logged in as the standard user
    When I add the "Sauce Labs Fleece Jacket" to the cart from inventory
    And I open the "Sauce Labs Onesie" product details and add it to the cart
    Then the cart badge should show 2 items
    When I open the cart page
    Then the cart should contain the expected products and prices
    When I proceed to checkout with JSONPlaceholder customer data
    Then the checkout overview should match the order details
    When I finish the purchase
    Then I should see the order complete confirmation