*** Settings ***

Library	 Collections
Library	 RequestsLibrary
Library  String
Library  DateTime
Library  OperatingSystem
Library  Dialogs

*** Variables ***

${URL} =    https://demouser:studentstudent@research.swisscom.ai/summarization
${USER} =    demouser
${PASSWD} =    studentstudent
${TITLE}=   Summarization
${TITLECLASS} =     'main-title'
${INPUTFIELD} =     id=url-submit
${ARTICLEURL} =     http://www.bbc.com/news/uk-england-42984368
${SUBMITBUTTON}=    id=btn-submit
${EXTRACTEDFROMCLASS}=    'aix-show-source result'
${SUMMARYCLASS}=    'title-summary result'

*** Keywords ***
Open Research Demos
    Go to   ${URL}
    sleep  1
Select Extractive model
    Click Element   //*[contains(@class, 'radio')][1]
Select Generative model
    Click Element   //*[contains(@class, 'radio')][2]
Select old Generative model
    Click Element   //*[contains(@class, 'radio')][3]
Set URL to article page
    Input Text  ${INPUTFIELD}   ${ARTICLEURL}
Verify it is the summarization website
    ${title}=       Get Text    //*[contains(@class, ${TITLECLASS})]
    Should Be Equal    Summarization    ${title}
Click summarize
    Click Element   ${SUBMITBUTTON}
Verify Url Is displayed in extracted from section
    ${arturl}=       Get Text    //*[contains(@class, 'aix-show-source result')]/a
    Should Be Equal    ${ARTICLEURL}     ${arturl}
Verify you have a summary from extraction
    Sleep   5
    Wait until Element is visible   //*[contains(@class, ${EXTRACTEDFROMCLASS})]
    Wait until Element is visible   //*[contains(@class, ${SUMMARYCLASS})]
Verify you have a generated summary
    Sleep   20
    Wait until Element is visible   //*[contains(@class, ${EXTRACTEDFROMCLASS})]
    Wait until Element is visible   //*[contains(@class, ${SUMMARYCLASS})]
Verify you have an exception
    Wait until Element is visible   id=error
Enter invalid Url
    Input Text  ${INPUTFIELD}   http://www.htmlhelp.com/de/reference/html40/fontstyle/small.html