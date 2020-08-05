# React components for scientific applications

[![Build Status](https://travis-ci.com/InformaticsMatters/react-sci-components.svg?branch=master)](https://travis-ci.com/InformaticsMatters/react-sci-components)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/InformaticsMatters/react-sci-components)

This repository is a collection of re-usable React components that can be used
to rapidly create what we term **mini-apps**, simple applications that are
designed with a specific purpose in mind. The initial domain of interest is
primarily computational chemistry and cheminformatics.

The initial components are in the early design phase and will appear here soon.

We anticipate these categories of component:

* Charting using [Plotly]
* 3D molecular viewer using [NGL Viewer]
* Chemical sketcher using [JSME] (and maybe other sketchers)
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
to the project's `.travis.yml`. Essentially it's a docker build command
like: -

    $ docker build -t informaticsmatters/im-mini-apps:latest .

## Deployment

Container images are automatically deployed from Travis using Job Templates
on our AWX server. The Job Templates are launched using scripts from our
[Trigger AWX] project.

## Application versioning

The application version (defined in `package.json`) is automatically set from
within the Dockerfile. If the `tag` build argument is not defined the version
of the application is `0.0.0`.

The CI/CD process in Travis sets the tag to the prevailing git tag.
So, to build and push version `1.0.0` tag the repository with `1.0.0`. 

>   As a consequence you **MUST NOT** adjust the version line in the
    package.json file.

# Example mini-apps

Our first mini-app is nearly ready.

## Pose viewer

This allows a SDF file with docking poses and scores to be effectively analysed. The expectation is to be easily able to
explore 10's of thousands of poses selecting those to examine in detail using a combination of scores in the SDF file.
The selected poses can be compared in 3D in the context of the receptor binding site that is specified as a PDB format file.

![Pose viewer](/images/pose-viewer.png)

There are 4 main re-usable components:

1. A small component that allows to define how to process the input SDF file.
2. A scatter plot component that allows the scores in the SDF file to be visualised and to select molecules of
interest.
3. A card view component that shows the molecules selected from the scatter plot as 2D structures along with their
properties (scores)
4. A re-usable NGL viewer component that allows to view the 3D poses of the molecules selected from the card view to be
viewed in the context of the protein binding site.


---

[Plotly]: https://plotly.com/javascript/
[NGL Viewer]: http://nglviewer.org/
[JSME]: https://peter-ertl.com/jsme/
[fragalysis]: https://fragalysis.diamond.ac.uk/
[fragnet-search]: https://fragnet.informaticsmatters.com/
[trigger awx]: https://github.com/InformaticsMatters/trigger-awx
