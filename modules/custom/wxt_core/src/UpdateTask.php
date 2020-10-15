<?php

namespace Drupal\wxt_core;

use phpDocumentor\Reflection\DocBlock;
use Symfony\Component\Console\Style\StyleInterface;

/**
 * Defines a value object wrapping a single optional configuration update.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class UpdateTask {

  /**
   * The task handler.
   *
   * @var object
   */
  protected $handler;

  /**
   * The reflector for the task method.
   *
   * @var \ReflectionMethod
   */
  protected $reflector;

  /**
   * The doc block for the task method.
   *
   * @var \phpDocumentor\Reflection\DocBlock
   */
  protected $docBlock;

  /**
   * UpdateTask constructor.
   *
   * @param object $handler
   *   The task handler.
   * @param \ReflectionMethod $reflector
   *   The reflector for the task method.
   * @param \phpDocumentor\Reflection\DocBlock $doc_block
   *   The doc block for the task method.
   */
  public function __construct($handler, \ReflectionMethod $reflector, DocBlock $doc_block) {
    $this->handler = $handler;
    $this->reflector = $reflector;
    $this->docBlock = $doc_block;
  }

  /**
   * Asks for confirmation before executing the task.
   *
   * @param \Symfony\Component\Console\Style\StyleInterface $io
   *   The output style.
   *
   * @return bool
   *   TRUE if the task is confirmed, FALSE otherwise.
   */
  protected function confirm(StyleInterface $io) {
    if ($this->docBlock->hasTag('ask')) {
      $tags = $this->docBlock->getTagsByName('ask');

      return $io->confirm(reset($tags)->getDescription());
    }
    return TRUE;
  }

  /**
   * Prompts for confirmation and executes the task.
   *
   * @param \Symfony\Component\Console\Style\StyleInterface $io
   *   The console style handler.
   * @param bool $force
   *   (optional) If TRUE, the task is executed without confirmation.
   */
  public function execute(StyleInterface $io, $force = FALSE) {
    $proceed = $force ? TRUE : $this->confirm($io);

    if ($proceed) {
      $this->reflector->invoke($this->handler, $io);
    }
  }

}
