# Build a Complete "PYQ Tests" Feature

Add a new major feature to the existing website called **PYQ Tests**.

The goal is to turn the existing collection of approximately **3,600 PYQ questions** into a fully functional, customizable test platform where users can generate tests by year, subject, topic, question type, or combinations of these filters.

Do **not** replace, modify, or lose the existing questions. The questions themselves are already intact. Build the testing system around them.

---

# 1. PYQ Tests Portal

Add a new section/page in the website called:

**PYQ Tests**

The landing page should contain:

### Create New Test

A prominent button/card:

**+ Create New Test**

### Test History

Show all previously completed tests.

Each test-history card should display:

- Test name
- Date taken
- Number of questions
- Time taken
- Score
- Accuracy
- Subjects/topics included
- Overall performance
- Button: **View Report**
- Button: **Retake Test**

The user should also be able to start a completely fresh test from here.

---

# 2. Create Test Flow

When the user clicks **Create New Test**, open a test-generation interface/modal.

The user should be able to configure the test using multiple filters.

The interface should feel simple despite having many options.

---

# 3. Select Questions By Year

Allow the user to select:

### Individual years

For example:

- 1984
- 1985
- 1986
- ...
- 2026

The user can select one or multiple years.

### Custom year range

Add:

**From Year:** [dropdown]

**To Year:** [dropdown]

Example:

> Generate a test from **2007 to 2011**

This should include all eligible questions from every year in that range.

The system must dynamically determine the available years from the question database rather than hardcoding years where possible.

---

# 4. Select Subjects

Allow selecting:

- One subject
- Multiple subjects
- All subjects

For example:

> COA + OS

After selecting multiple subjects, the test generator should treat them as separate sections.

The user should have an:

**ALL**

option.

If ALL is selected, questions from all selected subjects should appear in one combined playlist.

If individual subjects are selected, the test can retain subject sections.

---

# 5. Subject → Topic Selection

After selecting subjects, show the topics belonging to those subjects.

For example:

## Operating Systems

- Process Management
- CPU Scheduling
- Deadlocks
- Memory Management
- Virtual Memory
- File Systems
- I/O
- Synchronization
- etc.

By default:

**ALL TOPICS ARE SELECTED**

Add two buttons:

**Select All**

**Deselect All**

The user can then manually select/deselect individual topics.

---

# 6. Intelligent Topic Filters

Add additional topic-selection shortcuts.

The user should be able to choose:

### All Topics

Include everything selected above.

### Important Topics

Automatically select topics that have the greatest importance based on the actual PYQ dataset.

Determine importance using things such as:

- Number of PYQs appearing from the topic
- Historical question frequency
- Marks/weightage where available
- Frequency across years

Do not simply invent importance manually.

For example:

> CPU Scheduling — High importance  
> Deadlocks — High importance  
> File Systems — Medium importance

The underlying algorithm should use the actual PYQ distribution.

---

### Recent Topics

Add:

**Topics Appearing in Recent Years**

This should prioritize topics that appeared frequently in recent years.

Allow the system to define "recent" intelligently based on the available dataset, preferably using the latest several years.

---

### Most Repeated Topics

Add:

**Most Repeated Topics**

This selects topics with the highest number of historical appearances.

---

# 7. Number of Questions

Allow the user to choose the number of questions.

For example:

- 10
- 20
- 30
- 50
- 65
- 100
- Custom

If the available number of questions is smaller than the requested number, clearly tell the user how many are actually available.

Do not create duplicate questions unless the user explicitly asks for repetition.

---

# 8. Test Time

The default assumption is:

**1 minute 30 seconds per question**

Therefore:

> Default test time = Number of questions × 1.5 minutes

Examples:

20 questions → 30 minutes

40 questions → 60 minutes

60 questions → 90 minutes

100 questions → 150 minutes

Display the result in:

**Hours + Minutes**

For example:

> Estimated Time: 1 hr 30 min

Allow the user to change the time manually.

Provide either:

- Total test time input
- Or time-per-question input

Changing it should automatically update the calculated test duration.

---

# 9. Test Description Modal

Before actually beginning the test, show a **Test Description** modal.

Display:

## Test Details

- Number of questions
- Estimated time
- Subjects
- Topics
- Year range
- Question types
- Selected filters
- Whether important/recent topics were used

Example:

> **PYQ Test**
>
> Years: 2007–2011  
> Subjects: OS + COA  
> Topics: CPU Scheduling, Deadlocks, Memory Management, Cache  
> Questions: 50  
> Time: 1 hr 15 min

Then show a large button:

**BEGIN TEST**

Only after clicking BEGIN TEST should the actual test interface open.

---

# 10. Question-Type Handling

The testing engine MUST respect the actual question type.

Support:

## MCQ

- Display 4 options
- User can select exactly ONE option
- Selecting another option deselects the previous one

## MSQ

- Display all available options
- User can select MULTIPLE options
- Do not restrict the user to one option

## NAT

Show an answer input field.

The user should be able to type their numerical answer.

Support appropriate numerical answer formatting/tolerance according to the actual PYQ answer specification where available.

## Descriptive

Show a small text-answer box.

Do not unnecessarily make it enormous.

---

# 11. Question Type Correction / Issue Reporting

Every question should have an option:

**There is an issue**

If the user believes the question has been incorrectly classified, allow them to report it.

For example:

> Current type: NAT
>
> **Report incorrect question type**
>
> [MCQ] [MSQ] [NAT] [Descriptive]

If they select **MSQ**, dynamically change the answer interface to an MSQ interface with selectable options.

If they select **MCQ**, show the four-option MCQ interface.

Store this report so the question's classification can be reviewed/fixed later.

Do not silently overwrite the original question metadata just because one user reports an issue.

---

# 12. Test Navigation

The test interface should have a professional examination-style layout.

At the top:

### Header

Show:

- Test name
- Timer
- Submit Test button

Immediately below the timer/header, create a **section navigation bar**.

Example:

**ALL | OS | COA**

If the test contains:

OS + COA

the user can freely switch between:

**OS**

and

**COA**

at any point.

If they click:

**ALL**

show all questions together as one continuous playlist.

The section navigation should remain accessible while taking the test.

---

# 13. Question Navigation / Status System

Create a question navigator.

Each question should have a status.

Use the following exact behavior:

### Green

Question has been attempted/answered.

### Red + small dot/marker

Question has been visited but not answered.

### Orange

Question has never been visited.

### Purple

Question has explicitly been skipped using the Skip button.

This distinction is important.

For example:

- User opens Q1 and answers it → GREEN
- User opens Q2 but leaves it unanswered → RED
- User has never opened Q3 → ORANGE
- User clicks Skip on Q4 → PURPLE

Make the status visually obvious in the question navigator.

Include a small legend explaining the colors.

---

# 14. Skip Button

Every question should have:

**Skip**

If clicked:

- Move appropriately to the next question
- Mark the current question PURPLE
- Keep it available in the question navigator so the user can return to it later

Skipping must NOT permanently remove the question from the test.

---

# 15. Previous / Next Navigation

Provide:

**Previous**

**Next**

buttons.

The user should also be able to directly click any question number from the question navigator.

The user must be able to freely move backward and forward.

---

# 16. Persistent Answers

When the user navigates away from a question, their answer must remain saved.

For example:

Q12 → answer selected

User goes to Q30

User comes back to Q12

The answer must still be there.

Do not lose answers during navigation.

---

# 17. Timer

The timer should count down in real time.

Display prominently in the header.

Example:

**01:24:36**

When the timer reaches zero:

Automatically submit the test.

The user should receive a clear warning when time is running low.

---

# 18. Submit Test

Add:

**SUBMIT TEST**

Before submitting, show a confirmation modal.

For example:

> You have attempted 42/50 questions.
>
> 5 questions are unanswered.
>
> 3 questions were skipped.
>
> Are you sure you want to submit?

Buttons:

**Cancel**

**Submit Test**

---

# 19. ANSWER DATABASE — VERY IMPORTANT

The approximately **3,600 existing PYQs are already present in the website/database**.

Do NOT recreate the questions.

Do NOT replace the existing question content.

Instead, build an answer-verification pipeline.

The objective is to determine the correct answer for every existing PYQ.

Research the questions against reliable web sources and authoritative answer keys where available.

For each question, create/store structured answer metadata such as:

- Question ID
- Correct answer
- Question type
- Options
- Source/reference
- Confidence
- Explanation where possible
- Year
- Subject
- Topic

Use authoritative sources whenever possible, especially official examination answer keys.

Where multiple reliable sources disagree, flag the question for review instead of blindly choosing one.

The system should have the correct answer ready before the user submits a test.

Do NOT perform expensive web scraping during the user's actual test submission.

The answers should be researched/preprocessed ahead of time and stored in the application's database.

---

# 20. Answer Evaluation

When the user clicks Submit Test:

Evaluate every question against the stored correct answer.

### MCQ

Correct only if the selected option matches the correct option.

### MSQ

Compare the user's selected set against the correct set.

For example:

Correct:

A + C + D

User:

A + C + D

→ Correct

User:

A + C

→ Incorrect

User:

A + B + C + D

→ Incorrect

Unless the source's marking scheme specifies partial credit, do not invent partial-credit rules.

### NAT

Compare numerically using the official answer/tolerance where applicable.

### Descriptive

If a deterministic answer is available, compare appropriately.

If a descriptive answer cannot be reliably auto-graded, clearly mark it as:

**Manual Evaluation Required**

Do not pretend an uncertain automated evaluation is definitive.

---

# 21. Evaluation Screen

After submission, open a complete results/report page.

Show:

# Test Result

### Overall Score

Large score display.

For example:

**42 / 65**

Also display:

- Percentage
- Accuracy
- Correct
- Incorrect
- Unattempted
- Skipped
- Time taken
- Time remaining

---

# 22. Question-by-Question Review

Display every question with:

- Question
- User's answer
- Correct answer
- Question type
- Topic
- Subject
- Year
- Result

For an incorrect question:

Clearly show:

**Your Answer: B**

**Correct Answer: D**

Also show an explanation if available.

Use clear visual distinctions between:

- Correct
- Incorrect
- Unattempted
- Skipped

---

# 23. Topic Performance Analysis

This is a major feature.

After the test, calculate performance per topic.

For example:

| Topic | Correct | Wrong | Accuracy | Status |
|---|---:|---:|---:|---|
| CPU Scheduling | 8 | 2 | 80% | Strong |
| Deadlocks | 3 | 6 | 33% | Needs Work |
| Memory Management | 7 | 1 | 88% | Strong |

At the end, automatically identify:

### Topics You Need To Work On

Topics with the highest error rates.

Example:

> You need to work on:
>
> - Deadlocks
> - Virtual Memory
> - Cache Mapping

### Strong Topics

Topics with the lowest error rates / highest accuracy.

Example:

> Your strongest topics:
>
> - Process Scheduling
> - Paging
> - File Systems

Make this dynamic based on the actual test performance.

---

# 24. Subject-Level Analysis

Also show performance by subject.

Example:

**Operating Systems**

Accuracy: 72%

**Computer Organization**

Accuracy: 86%

This becomes particularly useful when the user selects multiple subjects.

---

# 25. Year-Level Analysis

Show performance by year where meaningful.

For example:

- 2007 — 80%
- 2008 — 65%
- 2009 — 90%
- 2010 — 72%
- 2011 — 83%

This can help identify whether older/newer PYQs are causing difficulty.

---

# 26. Test History

Every completed test should be saved.

The history should include:

- Test ID
- Date
- Configuration
- Questions
- Score
- Accuracy
- Time
- Topic performance
- Subject performance

The user can click any previous test to reopen its report.

Do NOT require the user to retake a test to see the report.

---

# 27. Retake Test

Each historical test should have:

**Retake Test**

This should recreate the same configuration.

However, decide whether the questions should be:

- exactly the same
- randomized order

Preferably preserve the test configuration while allowing question order to be randomized.

---

# 28. Randomization

When generating tests from a large question pool, randomize the selected questions unless the user explicitly requests chronological/year order.

Do not randomly change the answer options if doing so would break stored answer mappings.

If options are shuffled, update the answer mapping correctly.

---

# 29. Test Generation Logic

The test generator should essentially perform:

1. Select year/year range.
2. Select subject(s).
3. Select topic(s).
4. Apply topic intelligence filters if requested.
5. Filter the master PYQ database.
6. Remove invalid/unavailable questions.
7. Determine available question count.
8. Select requested number of questions.
9. Calculate default duration.
10. Generate test configuration.
11. Show Test Description.
12. Begin Test.
13. Save user answers/statuses.
14. Submit.
15. Evaluate.
16. Generate performance report.
17. Save test history.

---

# 30. "All" Playlist

If the user selects multiple subjects, provide:

**ALL**

as a virtual combined section.

Example:

**ALL | OS | COA | DBMS**

If the user selects ALL:

All questions from all selected subjects are shown in one continuous playlist.

If the user selects OS:

Only OS questions are displayed.

If the user switches to COA:

Navigate directly to COA questions.

The user should be able to switch sections at any time without losing progress.

---

# 31. UI/UX Requirements

Make this feel like a serious competitive-exam testing platform.

The design should be:

- Clean
- Fast
- Professional
- Exam-focused
- Responsive
- Easy to navigate
- Not overloaded with unnecessary decoration

The question itself should receive the majority of the visual focus.

Use consistent status colors:

- Green = Answered
- Red = Visited but unanswered
- Orange = Not visited
- Purple = Skipped

Make the status legend visible.

---

# 32. Important Data Architecture

Do not store test answers only inside frontend state.

Create a proper persistent structure.

At minimum, conceptually support:

### Question

- id
- year
- subject
- topic
- question_text
- question_type
- options
- correct_answer
- answer_source
- answer_confidence
- explanation

### Test

- id
- user_id
- configuration
- question_ids
- start_time
- end_time
- duration
- status
- score

### TestAttempt

- test_id
- question_id
- user_answer
- visited
- answered
- skipped
- result

### TopicPerformance

- test_id
- topic
- attempted
- correct
- incorrect
- accuracy

Adapt this architecture to the existing application's technology/database rather than unnecessarily introducing a completely new stack.

---

# 33. Answer Research Pipeline

For the 3,600 existing questions, build an offline/background answer-verification process.

The pipeline should:

1. Read every existing PYQ.
2. Identify the exam/year/question.
3. Search reliable web sources.
4. Locate official answer keys where available.
5. Cross-check with reputable educational sources when necessary.
6. Determine the answer.
7. Record the source.
8. Record confidence.
9. Flag ambiguous questions.
10. Store the verified result.

The test-taking experience must never depend on live web searching.

The web research is a **data-preparation task**, not a runtime dependency.

Do not fabricate answers when a source cannot establish the answer.

---

# 34. Handling Incorrect Existing Metadata

Because the existing dataset may contain incorrect question-type labels, subject labels, or topic labels, create a validation process.

Potential fields to validate:

- MCQ/MSQ/NAT/Descriptive classification
- Subject
- Topic
- Year
- Options
- Correct answer

If a question appears incorrectly classified, flag it.

The user-facing:

**There is an issue**

feature should allow users to report these issues.

---

# 35. Important Topics Algorithm

Do not hardcode arbitrary "important topics."

Calculate topic importance from the actual dataset.

Possible scoring model:

**Topic Importance Score =**

- PYQ frequency
- Historical recurrence
- Recent recurrence
- Marks/weightage where available

Normalize the score and classify topics into:

- Very High
- High
- Medium
- Low

Make this calculation configurable.

---

# 36. Recent Topic Algorithm

Create a recent-topic score based on the latest available years.

Recent appearances should carry greater weight than very old appearances.

For example:

A topic appearing repeatedly from 2022–2026 should rank higher under "Recent Topics" than a topic that appeared frequently only in 1990–2000.

Again, use the real dataset rather than fabricated values.

---

# 37. Empty Results Handling

If a user selects a combination that produces no questions:

Do not crash.

Show:

> No PYQs match your selected filters.

Then provide:

**Modify Filters**

If there are only a few questions:

> Only 17 questions match your current filters.

Then allow:

**Use 17 Questions**

or

**Modify Filters**

---

# 38. Preserve Existing Website

This feature must integrate with the existing website.

Do not:

- Delete existing questions
- Rewrite existing functionality unnecessarily
- Break existing routes
- Break existing authentication
- Replace the existing database
- Duplicate the question dataset

First inspect the existing codebase and understand:

- Current routing
- Database schema
- Question structure
- Subject/topic structure
- Authentication
- Existing UI components
- Existing styling system

Then integrate PYQ Tests naturally into the existing architecture.

---

# 39. Final Navigation Structure

Add something similar to:

**Dashboard**

**PYQs**

**PYQ Tests**

**Progress**

etc., depending on the existing site's current navigation.

Clicking **PYQ Tests** opens the test portal.

---

# 40. Test Portal Layout

The final PYQ Tests portal should approximately contain:

## PYQ Tests

**Create New Test**

---

### Recent Tests

Test cards with:

- Test name
- Score
- Accuracy
- Questions
- Date
- View Report

---

### Test History

Scrollable/searchable history.

---

# 41. Create-Test Interface Summary

The user should be able to configure:

### Years

- Specific year(s)
- Custom year range

### Subjects

- One
- Multiple
- All

### Topics

- All
- Important
- Recent
- Most Repeated
- Custom selection

### Number of Questions

- Presets
- Custom

### Question Types

Optionally allow:

- MCQ
- MSQ
- NAT
- Descriptive
- All

### Duration

Default:

**1.5 × number of questions**

User can customize.

---

# 42. Final Quality Requirement

This must be implemented as a **real working feature**, not a static frontend prototype.

All of the following must actually work:

- Question filtering
- Year ranges
- Subject selection
- Topic selection
- Important-topic filtering
- Recent-topic filtering
- Question generation
- Test timer
- Section navigation
- Question navigation
- Answer persistence
- MCQ selection
- MSQ multi-selection
- NAT input
- Descriptive input
- Skip functionality
- Question status tracking
- Test submission
- Answer evaluation
- Score calculation
- Topic analysis
- Subject analysis
- Test history
- Test reports
- Retaking tests
- Issue reporting

Before considering the feature complete, test the complete flow yourself:

**Create Test → Configure Filters → Generate Questions → Test Description → Begin Test → Answer Questions → Navigate Sections → Skip Questions → Submit → Evaluate → Results → Topic Analysis → Save History → Reopen Report → Retake**

Make sure there are no broken states, lost answers, incorrect status colors, or incorrect answer mappings.

Most importantly: **use the existing 3,600-question dataset as the source of truth for the questions and build the test engine around it.**