<?php

namespace Drupal\wxt\Context;

use Behat\Mink\Exception\ExpectationException;
use Drupal\Component\Serialization\Json;
use Drupal\DrupalExtension\Context\DrupalSubContextBase;

/**
 * Contains step definitions for working with CKEditor instances.
 *
 * @internal
 *   This is an internal part of WxT Core's testing system and may be
 *   changed or removed at any time without warning. It should not be extended,
 *   instantiated, or used in any way by external code! If you need to use this
 *   functionality, you should copy the relevant code into your own project.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
final class CkEditorContext extends DrupalSubContextBase {

  /**
   * Asserts that a CKEditor instance exists and is fully loaded.
   *
   * @param string $id
   *   (optional) The editor instance ID. Defaults to the first available
   *   instance.
   *
   * @return string
   *   A snippet of JavaScript for calling instance methods.
   *
   * @Given CKEditor :id exists
   *
   * @Then CKEditor :id should exist
   */
  public function assertEditor($id = NULL) {

    $CKEditor5 = $this->getSession()->evaluateScript("Drupal.CKEditor5Instances.size != 0");
    if ($CKEditor5) {
      $js = "Drupal.CKEditor5Instances.get(document.getElementById('" . ($id ?: $this->getDefault()) . "').dataset[\"ckeditor5Id\"])";
      $this->getSession()->wait(10000, "$js.state === 'ready'");
    }
    else {
      $js = "CKEDITOR.instances['" . ($id ?: $this->getDefault()) . "']";
      $this->getSession()->wait(10000, "$js.status === 'ready'");
    }

    return $js;
  }

  /**
   * Puts text or HTML into a CKEditor instance.
   *
   * @param string $text
   *   The text (or HTML) to insert into the editor.
   * @param string $id
   *   (optional) The editor instance ID.
   *
   * @When I put :text into CKEditor
   * @When I put :text into CKEditor :id
   */
  public function insert($text, $id = NULL) {
    $js = $this->assertEditor($id);
    $this->getSession()->executeScript("$js.insertHtml('$text');");
  }

  /**
   * Asserts that a CKEditor's content contains a snippet of text.
   *
   * @param string $text
   *   The text (or HTML) snippet to look for.
   * @param string $id
   *   (optional) The editor instance ID.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If the editor does not contain the specified text.
   *
   * @Then CKEditor should contain :text
   * @Then CKEditor :id should contain :text
   */
  public function assertEditorContains($text, $id = NULL) {
    $position = strpos($this->getContent($id), $text);

    if ($position == FALSE) {
      throw new ExpectationException(
        'Expected CKEditor ' . $id . ' to contain "' . $text . '".',
        $this->getSession()->getDriver()
      );
    }
  }

  /**
   * Assert that a CKEditor's content matches a regular expression.
   *
   * @param string $expr
   *   The regular expression to match.
   * @param string $id
   *   (optional) The editor instance ID.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If the expression does not match.
   *
   * @Then CKEditor should match :expression
   * @Then CKEditor :id should match :expression
   */
  public function assertEditorMatch($expr, $id = NULL) {
    $match = preg_match($expr, $this->getContent($id));

    if ($match == 0) {
      throw new ExpectationException(
        'Expected CKEditor ' . $id . ' to match "' . $expr . '".',
        $this->getSession()->getDriver()
      );
    }
  }

  /**
   * Gets the content of a CKEditor instance.
   *
   * @param string $id
   *   (optional) The editor instance ID.
   *
   * @return string
   *   The HTML content of the editor.
   */
  protected function getContent($id = NULL) {
    $js = $this->assertEditor($id);
    return $this->getSession()->evaluateScript("$js.getData()");
  }

  /**
   * Executes a CKEditor command.
   *
   * @param string $command
   *   The command ID, as known to CKEditor's API.
   * @param string $id
   *   (optional) The editor instance ID.
   * @param mixed $data
   *   Additional data to pass to the executed command.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If the command cannot be executed (i.e., returns a falsy value).
   *
   * @When I execute the :command command in CKEditor
   * @When I execute the :command command in CKEditor :id
   */
  public function execute($command, $id = NULL, $data = NULL) {
    $js = $this->assertEditor($id);

    $session = $this->getSession();

    $return = Json::decode($session->evaluateScript("$js.execCommand('$command', " . Json::encode($data) . ')'));

    if (empty($return)) {
      throw new ExpectationException(
        'CKEditor command ' . $command . ' returned ' . var_export($return, TRUE) . ', expected truthy.',
        $session->getDriver()
      );
    }
  }

  /**
   * Returns the first available CKEditor instance ID.
   *
   * @return string|false
   *   The first CKEditor instance ID, or FALSE if there are no instances.
   */
  private function getDefault() {
    $keys = $this->getKeys();
    return reset($keys);
  }

  /**
   * Returns all CKEditor instance IDs.
   *
   * @return string[]
   *   The CKEditor instance IDs.
   */
  private function getKeys() {
    $keys = $this
      ->getSession()
      ->evaluateScript('Object.keys(CKEDITOR.instances).join(",")');

    return explode(',', $keys);
  }

}
