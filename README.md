# Web Experience Toolkit: Drupal WxT

[![Build Status][githubci-badge]][githubci]

## Important Links

The following are links to some useful resources:

### General

- **[Documentation Website][docs]**
- **[CHANGELOG][changelog]**
- **[RELEASES][releases]**
- **[Issue Queue][issue-drupal]**

### Drupal

- **[Installation Profile][github-wxt]**
- **[Composer Project Template][github-wxt-project]**
- **[Composer Project Example][github-site-wxt]**

### Advanced

- **[Helm Chart for Kubernetes][github-helm-drupal]**
- **[Containers][containers]**
- **[Containers Scaffold][containers-scaffold]**

> **Note**: For up-to-date documentation please always consult our **[README.md][readme]** file.

## Overview

The **[Drupal WxT][github-wxt]** distribution is a web content management system which assists in building and maintaining multilingual web sites that are accessible, usable, and interoperable.

This distribution complies with the mandatory requirement to implement the **[Content and Information Architecture (C&IA) Specification][spec]** as well as consulting the reference implementation and design patterns provided by the **[Canada.ca design system][spec-canada]**.

This is accomplished through our integration and use of the components provided by the **[Web Experience Toolkit][wet-boew]** which undergoes routine usability testing as well as provides conformance to the Web Content Accessibility Guideline (WCAG 2.0) and complies to the standards on **[Web Accessibility][standard_accessibility]**, **[Web Usability][standard_usability]**, and **[Web Interoperability][standard_interoperability]**.

> **Note**: Drupal WxT is open source software (FOSS) led by the Government of Canada and free for use by departments, agencies and other external web communities.

## Architecture

For a look into some of the design decisions and considerations please consult:

- **[Architecture][docs-architecture]**

## Operation

### Installation

For a step by step guide on how to install Drupal WxT please consult:

- **[Installation][docs-installation]**

### Update Process

For a step by step guide on how the update process works in Drupal WxT please consult:

- **[Update Process][docs-update-process]**

## Deployments

### Containers

For the (optional) container based local development workflow please consult our documentation site:

- **[Containers][docs-containers]**

### Kubernetes

For a reference implementation on a Cloud Native deployment in use by several production sites please consult our documentation site:

- **[Kubernetes][docs-kubernetes]**

## Version History

### Changelog

- **[CHANGELOG][changelog]**

### Releases

- **[GitHub Releases][releases]**

## Contributor(s)

- **[Contributors][contributors]**

## Acknowledgements

Extended with code and lessons learned by the **[Acquia Team][acquia]** over at **[Lightning][lightning]** and **[BLT][blt]**.

<!-- Links Referenced -->

[acquia]:                    https://acquia.com
[blt]:                       https://github.com/acquia/blt
[changelog]:                 https://github.com/drupalwxt/wxt/blob/4.1.x/CHANGELOG.md
[containers]:                https://hub.docker.com/r/drupalwxt/site-wxt
[containers-scaffold]:       https://github.com/drupalwxt/docker-scaffold
[contributors]:              https://github.com/drupalwxt/wxt/graphs/contributors
[docs]:                      http://drupalwxt.github.io
[docs-architecture]:         https://drupalwxt.github.io/en/docs/development/architecture/
[docs-containers]:           https://drupalwxt.github.io/en/docs/environment/containers/
[docs-kubernetes]:           https://drupalwxt.github.io/en/docs/environment/kubernetes/
[docs-installation]:         https://drupalwxt.github.io/en/docs/general/installation/
[docs-update-process]:       https://drupalwxt.github.io/en/docs/general/update/
[githubci]:                  https://github.com/drupalwxt/wxt/actions
[githubci-badge]:            https://github.com/drupalwxt/wxt/workflows/build/badge.svg
[github-site-wxt]:           https://github.com/drupalwxt/site-wxt
[github-wxt]:                https://github.com/drupalwxt/wxt
[github-wxt-project]:        https://github.com/drupalwxt/wxt-project#user-content-new-project
[issue-drupal]:              https://drupal.org/project/issues/wxt
[github-helm-drupal]:        https://github.com/drupalwxt/helm-drupal
[lightning]:                 https://github.com/acquia/lightning
[readme]:                    https://github.com/drupalwxt/wxt/blob/4.1.x/README.md
[spec]:                      https://www.canada.ca/en/treasury-board-secretariat/services/government-communications/canada-content-information-architecture-specification.html
[spec-canada]:               https://wet-boew.github.io/GCWeb/index-en.html
[standard_accessibility]:    https://www.tbs-sct.gc.ca/pol/doc-eng.aspx?id=23601
[standard_usability]:        http://www.tbs-sct.gc.ca/pol/doc-eng.aspx?id=24227
[standard_interoperability]: http://www.tbs-sct.gc.ca/pol/doc-eng.aspx?id=25875
[releases]:                  https://github.com/drupalwxt/wxt/releases
[wet-boew]:                  https://github.com/wet-boew/wet-boew
