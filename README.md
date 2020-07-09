# React components for scientific applications

[![Build Status](https://travis-ci.com/InformaticsMatters/react-sci-components.svg?branch=master)](https://travis-ci.com/InformaticsMatters/react-sci-components)
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/informaticsmatters/react-sci-components?include_prereleases)

This repository is a collection of re-usable React components that can be used
to rapidly create what we term **mini-apps**, simple applications that are
designed with a specific purpose in mind. The initial domain of interest is
primarily computational chemistry and cheminformatics.

The initial components are in the early design phase and will appear here soon.

We anticipate these catergories of component:

* Charting using [Plotly](https://plotly.com/javascript/)
* 3D molecular viewer using [NGL Viewer](http://nglviewer.org/)
* Chemical sketcher using [JSME](https://peter-ertl.com/jsme/) (and maybe other sketchers)
* Molecule card view
* Molecular spreadsheet

Some of these components are inspired and partly derived from the [Fragalysis]
and [Fragnet Search] applications, and most likely will be re-incorporated
into those applications as components.

This repo will contain:

1. Source code for each component
2. Documentation and examples for using each component
3. Examples of how to combine components

## Building

The application is distributed as a container image, normally built
automatically by Travis. To understand how to build the app refer
to the project's `.travis.yml`.

---

[fragalysis]: https://fragalysis.diamond.ac.uk/
[fragnet-search]: https://fragnet.informaticsmatters.com/
