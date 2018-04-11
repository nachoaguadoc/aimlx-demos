*** Settings ***

Resource  ../Resources/Common.robot
Resource  ../Resources/Summarizor/MainPage.robot

*** Test Cases ***
User can login
    Open Browser for testing
    Open Research Demos
    Verify it is the summarization website
    Close Browser after testing
User can select model
    Open Browser for testing
    Open Research Demos
    Select Generative model
    Select old Generative model
    Select Extractive model
    Close Browser after testing
User can get extracted summarization
    Open Browser for testing
    Open Research Demos
    select extractive model
    set url to article page
    click summarize
    verify you have a summary from extraction
    verify url is displayed in extracted from section
    Close Browser after testing
User can get generated summarization
    Open Browser for testing
    Open Research Demos
    Select Generative model
    set url to article page
    click summarize
    verify you have a generated summary
    verify url is displayed in extracted from section
    Close Browser after testing
User gets error from non valid site
    Open Browser for testing
    Open Research Demos
    Enter invalid Url
    click summarize
    Verify you have an exception