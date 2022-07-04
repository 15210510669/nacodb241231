---
title: "Timely Build"
description: "Timely Build"
position: 5000
category: "Engineering"
menuTitle: "Timely Build"
---

NocoDB provides timely build versions on Docker and Executables by compiling our source code and packaging as a deliverable so that it can

- reduce pull request cycle time
- allow issue reporters / reviewers to verify the fix without setting up their local machines

## Docker

When a non-draft Pull Request is created, reopened or synchronized, a timely build for Docker would be triggered for the changes only included in the following paths.

- `packages/nocodb-sdk/**`
- `packages/nc-gui/**`
- `packages/nc-plugin/**`
- `packages/nocodb/**`

The docker images will be built and pushed to Docker Hub (See [nocodb/nocodb-timely](https://hub.docker.com/r/nocodb/nocodb-timely/tags) for the full list). Once the image is ready, Github bot will add a comment with the command in the pull request. The tag would be `<NOCODB_CURRENT_VERSION>-pr-<PR_NUMBER>-<YYYYMMDD>-<HHMM>`. 

![image](https://user-images.githubusercontent.com/35857179/175012097-240dab05-da93-4c4e-87c1-1c36fb1350bd.png)

## Executables

Similarly, we provide a timely build for executables for non-docker users. The source code will be built, packaged as binary files, and pushed to Github (See [nocodb/nocodb-timely](https://github.com/nocodb/nocodb-timely/releases) for the full list). 

Currently, we only support the following targets:

- `node16-linux-arm64`
- `node16-macos-arm64`
- `node16-win-arm64`
- `node16-linux-x64`
- `node16-macos-x64`
- `node16-win-x64`

Once the executables are ready, Github bot will add a comment with the commands in the pull request. 

![image](https://user-images.githubusercontent.com/35857179/175012070-f5f3e7b8-6dc5-4d1c-9f7e-654bc5039521.png)
