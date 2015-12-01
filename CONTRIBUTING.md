# Contributing to DreemGL

We'd love for you to contribute to our source code and to make DreemGL even better. Here are the guidelines we'd like you to follow:

 - [Signing the CLA](#cla)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)

## <a name="cla"></a> Signing the CLA

Please sign our Contributor License Agreement (CLA) before sending pull requests or making code change suggestions. For any code changes or documentation examples or bug fixes to be accepted, the CLA must be signed. It's a quick process, we promise!

1. Print and sign the [CLA].
2. Email the signed version to contributors@teem.nu.
3. We'll email you back a signed version for your records.


## <a name="question"></a> Got a Question or Problem?

If you have questions about how to use DreemGL, please direct these to Teem's [#dev channel] in Slack. 

If you receive help, then help others when they have questions. Pay it forward and everyone wins.

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by creating an issue in JIRA. 

Even better you can submit a Pull Request to the Dev branch with a fix.  **Please see the Submission Guidelines below**.

## <a name="feature"></a> Want a Feature?
You can request a new feature through the #feature_requests channel on Slack. If you would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed on the Teem's Slack [#dev channel] or  [#feature_requests channel].  This lets us better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project and accomplishes what you hoped.


* **Small Changes** can be implemented and submitted to the **dev branch** of the [DreemGL] github repository using our [Submission Guidelines](#submit).

## <a name="docs"></a> Want a Doc Fix?
If you've found an error in the documentation, please share it on the [#dev channel] in Slack. If you have a useful example or documentation that would help others use DreemGL, please take the time to file it in [JIRA] so that we can include it in the project. 

The method for submitting a documentation change and example is straightforward. 
1. Make sure you've signed the CLA. Create a [JIRA] task with a descriptive title that has the preface: "DOC: put your title here". 
2. In the Description, provide the sample code and documentation that describes it, if it is simple. Be sure to include which source file it should be part of so that it can be rendered along with the rest of the DreemGL documentaiton. 

If it is a more complex example, please ATTACH the file to the JIRA item including any files the example may require. 

3. If you have any qeustions, please ask on Teem's [#dev channel] in Slack. 

**Thanks for helping us improve the documentation!**


## <a name="submit"></a> Submission Guidelines

### Submitting an Issue
Before you submit your issue, first search in JIRA to see if it has already been reported. 

If your issue appears to be a bug, and hasn't been reported, create a new issue. In Jira, please start with a descriptive Title for the problem and then include the following information in the Description section:

* **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps.
* **Browsers and Operating System** - is this a problem with all platforms/browsers or only Windows/Mac OS X? Is something rendering improperly in DALi or WebGL? 
* **Steps to Reproduce the Error** - provide an example (best) or give detailed steps to reproduce the error.
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be causing the problem (line of code or commit)
* **Your Email Address** - include your email address so that we can ask questions directly if needed.


### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Please sign our [Contributor License Agreement (CLA)](#cla) before sending pull requests. We cannot accept code without this.
* Create a JIRA item for the task.
* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch dev
     ```

* Create your patch, **including appropriate test cases**.
* Commit your changes using a descriptive commit message that follows our format of referencing the JIRA item as follows "DREEM-#######: commit message" so that it is automatically linked to the bug report. 

     ```shell
     git commit -m "DREEM-#####:commit message" -a
     ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Build your changes locally to ensure all the tests pass by runing the server:

    ```shell
    node server.js
    ```

* Test your changes locally in your browser by going to:  http://127.0.0.1:2000/editor 

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `onejsdev` (Rik Arends) if it is a large changeset or 'amuntz' (Amy Darling) if it is a smaller change set. In either case, it will be reviewed by someone at Teem.

* If we suggest changes then:
  * Make the required updates.
  * Re-run the local tests
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase dev -i
    git push origin my-fix-branch -f
    ```
That's it!    
**Thank you for your contribution!**

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the dev branch:

    ```shell
    git checkout dev -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your dev with the latest version:

    ```shell
    git pull --ff upstream dev
    ```
At regularly scheduled intervals, the dev branch will be tested and pushed to master (as the stable, working branch). 


[JIRA]: https://dreem2.atlassian.net
[#dev channel]: https://teem.slack.com/messages/dev/files/F0CR81Y4C/
[#feature_requests channel]: https://teem.slack.com/messages/feature_requests/files/F0CR81Y4C/
[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
[DreemGL]: https://github.com/teem2/dreemgl
[CLA]: https://github.com/teem2/dreemgl/CLA.pdf 
