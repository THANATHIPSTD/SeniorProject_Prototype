

## IDRS
(Integrated Dental Record System)

## Project Proposal

## Thanathip Sujitthananon 662115023
## Chawaphat Akaraphat 662115010



Bachelor of Science
## Software Engineering Program


College of Arts, Media, and
## Technology Chiang Mai University


## Project Advisor
Pikul Vejjanugraha, Ph.D.



## Document
## Name
IDRS_Proposal Owner TS, CA Page 1 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026


## Document History




## Document Name History Status Date Editable Reviewer
Proposal_IDRS_v0.1.0
Chapter 1-2 C 13-3-2026 TS, CA -
Proposal_IDRS_v0.2.0
Chapter 3 C 15-3-2026 TS, CA -
Proposal_IDRS_v0.2.1
Chapter 1-3  R  23-3-2026 -  PV
Proposal_IDRS_v0.3.0
## Chapter 1-3

## U 23-3-2026 TS, CA -
Proposal_IDRS_v0.3.1
Chapter 1-3 R 24-3-2026 - PV
Proposal_IDRS_v1.0.0
Chapter 1-3 U 24-3-2026 TS, CA -
Proposal_IDRS_v1.1.0
Chapter 1,3  U 23-4-2026 TS, CA -
Proposal_IDRS_v1.1.1
Chapter 1,3 R  23-4-2026 - PV
*TS = Thanathip Sujitthananon
*CA = Chawaphat Akaraphat
*PV = Pikul Vejjanugraha


## Status:
## C = Create
R = Reviewed by advisor
## U = Update
## D = Delete


## Version:
document name_v X.Y.Z
X: External published
Y: Test approval
Z: Internal review




## Document
## Name
IDRS_Proposal Owner TS, CA Page 2 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## TABLE OF CONTENTS

Chapter One | Introduction and Rationale .......................................... 4
1.1 Motivation............................................................................................................................................ 4
1.2 Purpose ................................................................................................................................................ 5
1.3 Target users (Persona) ......................................................................................................................... 6
Chapter Two | Literature Review ......................................................... 8
2.1 Business Review / Software Review ................................................................................................... 8
2.1.1 GoodNotes .................................................................................................................................................... 8
2.1.2 Dentrix Ascend ........................................................................................................................................... 10
2.1.3 iDentist ....................................................................................................................................................... 12
2.1.4 Curve Dental............................................................................................................................................... 13
2.1.5 Comparative Table ..................................................................................................................................... 14
2.2 Tool and Technology Review ............................................................................................................ 15
Chapter Three | Project Plan .............................................................. 19
3.1 Product Perspective ........................................................................................................................... 19
3.2 Objectives .......................................................................................................................................... 20
3.3 Project scope ...................................................................................................................................... 20
3.4 Type of System Users and the Users’ Characteristics ....................................................................... 21
3.5 Acronyms and Definitions ................................................................................................................. 22
3.5.1 Acronyms ................................................................................................................................................... 22
3.5.2 Definitions .................................................................................................................................................. 22
3.6 System Architecture ........................................................................................................................... 23
3.7 Product Features ................................................................................................................................ 25
Feature 1: Authentication .................................................................................................................................... 25
Feature 2: Patient Management .......................................................................................................................... 25
Feature 3: Dental Charting .................................................................................................................................. 26
Feature 4: Image Management ........................................................................................................................... 26
Feature 5: X-ray Dental Condition Detection ..................................................................................................... 27
Feature 6: PDF Export ......................................................................................................................................... 27



## Document
## Name
IDRS_Proposal Owner TS, CA Page 3 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

3.8 Limits ................................................................................................................................................. 28
3.9 Deliverable Items ............................................................................................................................... 28
3.10 Milestones ........................................................................................................................................ 29
Phase 1. Proposal ................................................................................................................................................. 29
Phase 2. Progress I .............................................................................................................................................. 30
Phase 3. Progress II ............................................................................................................................................. 31
Phase 4. Final Progress ........................................................................................................................................ 32
Chapter Four | Reference .................................................................... 33



## TABLE OF FIGURES
Figure 1: Persona of the Dentist ..........................................................................................6
Figure 2: Persona of Dental assistant ...................................................................................7
Figure 3 Goodnote - Note-taking page ................................................................................9
Figure 4 Goodnote - Folder & File Management ................................................................9
Figure 5 Dentrix Ascend - Dashboard tooth chart .............................................................10
Figure 6 Dentrix Ascend - Callendar Pinboard .................................................................11
Figure 7: Dentrix Ascend - Edit Perio exam......................................................................11
Figure 8: iDentist – Patient medical records ......................................................................12
Figure 9: iDentist – Template Management treatment types .............................................12
Figure 10: Curve Dental – Charting ..................................................................................13
Figure 11: Curve Dental – Image storage ..........................................................................13
Figure 12: System Architecture Diagram ..........................................................................23
Figure 13: Phase 1 Milestone ............................................................................................29
Figure 14: Phase 2 Milestone ............................................................................................30
Figure 15: Phase 3 Milestone ............................................................................................31
Figure 16: Phase 4 Milestone ............................................................................................32




## Document
## Name
IDRS_Proposal Owner TS, CA Page 4 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

Chapter One | Introduction and Rationale

## 1.1 Motivation

Accurate and efficient dental record management is fundamental to delivering high-quality patient
care.  However,  many  dental  clinics  still  rely  on  outdated  manual  recording practices,  resulting  in
disorganized, inaccessible, and error-prone patient information.

The current dental charting workflow is highly inefficient and time-consuming, often exceeding 30
minutes  per  patient  case.  It  depends  heavily  on  manual  input,  such  as  paper-based  records  or  digital
notetaking on tablets, which increases the likelihood of errors. Miscommunication between dentists and
dental assistants particularly when dealing with complex clinical terminology further compromises data
accuracy.

In  addition,  clinical  workflows  are  frequently  interrupted.  Dentists  are  often  required  to  pause
examinations,  remove  gloves,  and  record  findings  themselves  due  to  limited  assistant  availability,
multitasking, or insufficient familiarity with technical terms. These interruptions reduce productivity and
disrupt clinical focus.

The diagnostic process also remains largely manual. Dentists must carefully examine X-ray and
intraoral images to identify conditions such as caries, fractures, or missing teeth on a per-tooth basis. This
repetitive  and  cognitively  demanding  process  increases  the  risk  of  oversight  and  delays  diagnosis,
ultimately impacting treatment outcomes and patient care quality.

Therefore,  there  is  a  critical  need  for  a  unified  digital  platform  that  streamlines  dental  charting,
integrates multimodal clinical data, and leverages AI-based dental object detection on panoramic X-ray
images to preliminarily identify dental conditions. Such a system can enable real-time charting, support
preliminary  diagnosis and assist  decision-making,  reduce  clinical  workload,  and  enhance  overall
workflow efficiency and patient outcomes.


## Document
## Name
IDRS_Proposal Owner TS, CA Page 5 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 1.2 Purpose

The  Integrated  Dental  Record  System  is  a  web-based  dental  record  management  platform
developed  to  address  inefficiencies  in  current  manual  dental  documentation  practices.  This
platform  provides  a  centralized  digital  environment  for  dentists  and  dental  assistants  to  record,
manage, and analyze patient dental data in a structured and accessible manner, enhancing clinical
efficiency and reducing reliance on traditional paper-based records.

The  platform  is  designed  to  improve  documentation  efficiency  and  streamline  clinical
workflows.  It  reduces  recording  time  and  enables  dentists  and  dental  assistants  to  input
examination data seamlessly through an optimized and intuitive interface, without interrupting the
examination process. In addition, it consolidates all patient-related information including clinical
charting data, intraoral photographs, and panoramic X-ray images within a unified platform. This
supports  integrated  data  management  and  treatment  planning  while  minimizing  fragmentation
across disconnected systems.

Furthermore, the platform incorporates AI-assisted dental object detection on panoramic X-
ray  images  to  preliminarily  identify  dental  conditions  such  as dental  caries,  crowns,  implants,
impacted teeth. Detection results are presented in two complementary forms: as annotated visual
overlays  on  the  X-ray  image,  including  bounding  boxes  and  condition  labels,  and  as  condition
suggestions directly within the dental charting interface, allowing dentists to review and confirm
findings before updating the patient record.



## Document
## Name
IDRS_Proposal Owner TS, CA Page 6 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

1.3 Target users (Persona)

1.3.1 Dentists Responsible for  patient  examinations  and  treatment  planning,  who  require  a
structured  and  efficient  platform  to  record  clinical  data,  manage  patient  records,  and  analyze
dental conditions without interrupting the examination workflow.




Figure 1: Persona of the Dentist


## Document
## Name
IDRS_Proposal Owner TS, CA Page 7 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

1.3.2 Dental Assistant Supporting personnel who assist dentists during examinations by recording
data as directed by the dentist, requiring a simple and intuitive interface that reduces the reliance on
complex dental terminology and minimizes recording errors during fast-paced clinical sessions.


Figure 2: Persona of Dental assistant



## Document
## Name
IDRS_Proposal Owner TS, CA Page 8 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## Chapter Two | Literature Review

Currently,  dental  clinics  utilize  a  variety  of  systems  to  manage  patient  data  and  clinical
workflows,  ranging  from  general-purpose  note-taking  applications  such  as  GoodNotes  to
specialized dental practice management systems like Dentrix Ascend, iDentist, and Curve Dental.
While these tools provide different  levels of functionality, they often operate independently and
are not fully integrated.

General-purpose tools offer flexibility for freehand documentation but lack structured data
management  and  efficient  retrieval.  In  contrast,  dedicated  dental  systems  provide  structured
databases and charting features but are often complex and require significant training, particularly
for dental assistants working in fast-paced clinical environments.

As  a  result,  existing  solutions  present  trade-offs  between  flexibility,  usability,  and
integration, leading to inefficiencies in clinical workflows and increased risk of recording errors.

## 2.1 Business Review / Software Review

2.1.1 GoodNotes

GoodNotes is a widely used digital note-taking application designed for tablet devices. As
shown in Figure 3, it provides a flexible interface that allows users to write and annotate
content  using  a  stylus.  Additionally,  as  illustrated  in Figure  4,  the  application  includes
folder and file management features for organizing documents. [1]


In clinical settings, particularly among dentists, GoodNotes is commonly used to support
manual dental documentation. Based on informal interviews with dentist, the application
is  frequently  used  to  import  blank  PDF  charting  templates,  manually  record  patient
histories,   annotate   tooth   diagrams,   and   insert   intraoral   images   directly   into   the
documentation.  This  approach  enables  flexible  and  real-time  note-taking  during  the
examination process.




## Document
## Name
IDRS_Proposal Owner TS, CA Page 9 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026


Strengths: GoodNotes offers high flexibility for freehand writing, drawing, and audio
recording, making it suitable for capturing clinical observations in an intuitive and
adaptable manner during clinical practice.

Weaknesses: However, the data is stored as unstructured handwritten notes or flat files,
resulting  in  fragmented and  disconnected patient  records.  This  lack  of  structured  data
management   and   interoperability makes   it   difficult   to retrieve specific   historical
information, perform longitudinal analysis, or maintain consistent records across multiple
patient visits.

Overall,  while  GoodNotes  provides  flexibility  for  manual  documentation,  it  lacks  the
structured data organization, integration,  and analytical capabilities required for efficient
and scalable clinical data management.





Figure 3 Goodnotes - Note-taking page


## Figure 4 Goodnotes - Folder & File Management


## Document
## Name
IDRS_Proposal Owner TS, CA Page 10 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026


## 2.1.2 Dentrix Ascend

Dentrix Ascend is a comprehensive, cloud-based dental practice management system that
includes  dedicated  digital  charting  modules.  As  shown  in  Figure  5,  dentists  can  interact
with  graphical  2D  or  3D  tooth  models  to  record  clinical  conditions.  Additionally,  as
illustrated  in Figure 6, the system provides scheduling and patient  management features
through  a  calendar-based  interface.  Furthermore,  Figure  7 demonstrates  the  periodontal
examination module, which allows users to input detailed periodontal data efficiently. [2]

In  clinical  practice,  Dentrix  Ascend  supports  structured  data  management  by  integrating
patient records, charting, and administrative workflows within a centralized platform. This
integration enables more consistent documentation and facilitates treatment planning and
communication.

Strengths: Dentrix Ascend provides a highly  structured and centralized  patient database
that integrates clinical  charting with administrative functions such as scheduling. The use
of 2D  and  3D graphical models enhances  visualization  of  dental  conditions,  supporting
accurate recording and effective communication of treatment plans.

Weaknesses: However, the  system exhibits  a  steep  learning  curve  due  to its  complexity
and extensive feature set. The multi-step workflows and technical requirements can reduce
usability, particularly for dental assistants who must perform data entry in real-time while
multitasking. This may lead to inefficiencies in fast-paced clinical environments.

Overall, while Dentrix Ascend offers strong data structure and system integration, its
complexity and usability challenges limit its effectiveness in supporting efficient real-
time clinical workflows.




Figure 5 Dentrix Ascend - Dashboard tooth chart


## Document
## Name
IDRS_Proposal Owner TS, CA Page 11 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026



## Figure 6 Dentrix Ascend - Calendar Pinboard




Figure 7: Dentrix Ascend - Edit Perio exam


## Document
## Name
IDRS_Proposal Owner TS, CA Page 12 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

2.1.3 iDentist

iDentist is  a  mobile  and  desktop  electronic  medical  record  (EMR)  system  designed  for
dental clinics to manage patient visits and basic clinical records. As shown in Figure 8, the
system  provides  an  interface  for  managing  patient  medical  records,  while Figure  9
illustrates template management for different treatment types. [3]

In   clinical   practice,   iDentist   supports   structured   data   entry   medical   histories   and
appointment scheduling. It also includes a built-in image gallery for organizing patient X-
ray images, enabling basic digital record management within a single application.

Strengths: The system provides a structured database for storing patient information and
supports standardized clinical documentation. Its template-based approach simplifies data
entry and helps maintain consistency across patient records.

Weaknesses: However, iDentist primarily functions as a standalone system limited to the
device on which it is installed. The lack of a centralized cloud infrastructure and integrated
network prevents real-time data synchronization across multiple devices or clinic stations.
This   limitation   can   lead   to   fragmented   data   storage,   reduced   accessibility,   and
inefficiencies in collaborative clinical workflows.

Overall,  while  iDentist  offers  structured  record  management  at  a  basic  level,  its  lack  of
system  integration  and  scalability  limits  its  effectiveness  in  modern,  multi-user  clinical
environments.




Figure 8: iDentist – Patient medical records                   Figure 9: iDentist – Template Management treatment types



## Document
## Name
IDRS_Proposal Owner TS, CA Page 13 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 2.1.4 Curve Dental

Curve Dental is a cloud-based dental practice management platform designed to support clinics
of various sizes. As shown in Figure 10, the system provides digital charting tools that allow
clinicians  to  record  and  visualize  dental  conditions.  In  addition,  Figure  11  illustrates  the
integrated image storage and management functionality.

In clinical practice, Curve Dental emphasizes accessibility and ease of use through its fully cloud-
based architecture. The system allows users to access patient data from multiple locations without
requiring  dedicated  servers  or  complex  IT  infrastructure, supporting  flexible  and  scalable
deployment across clinics.

Strengths: Curve Dental offers a user-friendly interface that enables new staff to learn and
adopt the system quickly. Its cloud-based design supports remote access and centralized
data    storage,    improving    accessibility    and    reducing    infrastructure    requirements.
Customizable templates further enhance usability for routine clinical documentation.

Weaknesses: However,   the   system   demonstrates   limitations   in   advanced   clinical
functionality. Charting  and  patient  communication features  are  less  comprehensive
compared  to more  specialized  systems,  and  the imaging module  has  limited  analytical
capabilities, lacking measurement tools for detailed X-ray analysis. These limitations can
reduce diagnostic precision and constrain in-depth clinical evaluation. Additionally, some
users  report  a  learning  curve  during  initial system setup and  limitations  in billing
functionalities.

Overall,  while  Curve  Dental  provides  strong  usability  and  cloud  accessibility,  its
limitations  in  advanced  clinical  and  analytical  features  reduce  its  effectiveness  for
comprehensive diagnostic and treatment planning workflows.



Figure 10: Curve Dental – Charting                 Figure 11: Curve Dental – Image storage



## Document
## Name
IDRS_Proposal Owner TS, CA Page 14 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 2.1.5 Comparative Table
Aspect GoodNotes Dentrix
## Ascend
iDentist Curve
## Dental
## IDRS
## Dental-specific
## Charting
## None
## (manual)
## Full Full Full Full
## Patient
## Management
## None Full Limited Full Full
## Image & X-ray
## Management
## Limited Full Limited Full Full
AI Dental
## Detection
## None Add-on Limited None Integrated
(Real-time)
## Workflow
## Efficiency
## High
## (flexible)
## Moderate Low Moderate High
(Optimized)
## Data Integration None Full Limited Full Full
Ease of Use High Low Moderate High High
## Platform Tablet Web-
based
## Desktop
/Mobile
## Web-based Web-based

None = Feature not supported
Limited = Partially supported with functional or integration constraints
Full = Fully supported





## Document
## Name
IDRS_Proposal Owner TS, CA Page 15 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026


2.2 Tool and Technology Review

## 2.2.1 External Service
Name Description Alternative The selection of technology

## GITHUB
Online version control
platform that is used to
develop software with a
team. [5]
## • Gitlab
## • Bitbucket
- GitHub used for version
control, collaboration and code
management
- Everyone in team can use
GitHub

## Docker
Container software allows
user to create a virtual
environment for sharing the
software without any
hardware issue [6]

- Simple setup suitable for
small-scale projects
- Large community and mature
ecosystem




## Supabase
An open-source backend
platform built on
PostgreSQL that bundles
database, authentication, file
storage, and auto-generated
REST APIs into a single
unified platform. [7]
## • Firebase

- Provides Auth, Database, and
Storage in one platform
without managing separate
services
- Free tier includes 500MB
database and 1GB storage,
suitable for this project scale


roboflow
A computer vision platform
that facilitates dataset
management, model
training, and deployment for
object detection tasks. It
provides pre-built dental X-
ray datasets and a hosted
inference API. [8]
## • Google
## Cloud
## Vision
- Provides ready-to-use dental
X-ray datasets including
conditions such as caries,
fillings, missing teeth, and
implants
- Simplifies model training and
deployment without requiring
dedicated GPU infrastructure


## Document
## Name
IDRS_Proposal Owner TS, CA Page 16 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026


## 2.2.3 Library / Framework / Database
Name Description Alternative The selection of technology


## React
A JavaScript library
developed by Meta for
building dynamic user
interfaces with a
component-based
architecture and Virtual
## DOM. [9]
## • Vue
## • Next.js
- React dominates in developer
activity with the largest
ecosystem and job market. Its
extensive library support and
component-based architecture
make it well-suited for building
complex UI such as Visual
Tooth Chart and interactive
dental forms.

## Vite
A modern frontend build
tool that serves source files
directly as native ES
modules during
development and uses
Rollup for optimized
production builds. [10]

- For most new projects in 2025,
Vite offers a compelling blend of
speed, modern features, and
developer experience. Its near-
instant server startup and fast
HMR significantly improve
development efficiency
compared to Webpack.
2.2.2 Development tools
Name Description Alternative The selection of technology

VS code
A lightweight code editor
with extensive extension
support for frontend
development.

- Free and lightweight
- Rich extension support for React
and Tailwind

PyCharm
A Python-focused IDE with
built-in debugging, virtual
environment management,
and intelligent code
completion.
- VS Code • Built-in Python debugger and
virtual environment
- Intelligent code completion for
FastAPI


## Document
## Name
IDRS_Proposal Owner TS, CA Page 17 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026



Tailwind CSS
A utility-first CSS
framework that enables
rapid UI development by
composing styles directly
in HTML markup without
writing custom CSS. [11]
## • Bootstrap

- Provides full design flexibility
without opinionated component
styles, allowing a clean and
clinical UI suitable for a
medical platform. Works
seamlessly with Shadcn/ui.


## Shadcn/ui
A collection of accessible
and customizable UI
components built on Radix
UI and styled with
Tailwind CSS. [12]
- Material UI • Components are fully
customizable and not bundled
as a dependency, giving full
control over the codebase.
Clean and professional design
suitable for a clinical
application.



React-PDF
A React library that enables
PDF  generation  by  writing
document  layouts  as  React
components, producing
structured PDF files
directly in the browser. [13]
- WeasyPrint
- jsPDF
- Allows the team to write PDF
layouts using familiar React
syntax, eliminating the need for
a separate backend PDF
generation service. Provides full
control over the dental chart
layout and structure.

## Axios
A    promise-based    HTTP
client   for   JavaScript   that
handles API requests
between  the  frontend  and
backend. [14]
- Fetch API
- Provides cleaner error handling
and request/response
interceptors compared to the
native Fetch API, simplifying
JWT token attachment across
all API requests.


FastAPI
An  async-first  Python  web
framework  with  automatic
OpenAPI    documentation,
ideal    for    AI/ML    model
serving and real-time APIs.
## [15]
## • Flask
## • Django
- FastAPI is best for API-first
work that depends on speed and
type-driven development. Its
native Python support simplifies
integration with the YOLO AI
model.


## Document
## Name
IDRS_Proposal Owner TS, CA Page 18 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026



PostgreSQL
A powerful open-source
relational database system that
stores  structured  patient  and
clinical   charting   data   with
support  for  complex  queries
and relationships. [16]
- MySQL
- MongoDB
- Patient and charting data has a
well-defined relational structure.
PostgreSQL provides strong data
integrity and is included in
Supabase alongside Auth and
Storage, reducing infrastructure
complexity.


## YOLO

A state-of-the-art real-time
object detection model
developed by Ultralytics,
supporting object detection,
segmentation, and
classification tasks. [17]
- YOLO • Anchor-free  architecture  provides
high  accuracy  and  fast  inference
suitable for dental X-ray detection
- Pre-built dental X-ray datasets on
Roboflow are predominantly
configured in YOLO format,
reducing preprocessing effort



## Document
## Name
IDRS_Proposal Owner TS, CA Page 19 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## Chapter Three | Project Plan


## 3.1 Product Perspective

The  Integrated  Dental  Record  System  is  a  web-based  platform  designed  to  provide  a
structured  and  efficient  solution  for  dental  data  management.  It  supports dentists and  dental
assistants  in  recording,  managing,  and  analyzing  patient  dental  data.  The  system  acts  as  a
centralized  hub  that  integrates  clinical  examination  and  digital  documentation  into  a  unified
workflow.

The platform operates  as an independent system  and  does  not  rely  on  integration  with
external  hospital  information systems or  third-party  clinical  software.  It  consolidates  patient-
related information including clinical charting data, intraoral photographs, and panoramic X-ray
images  into  a centralized  and organized  environment,  eliminating  the  need  to  switch  between
multiple tools during clinical practice.

Users interact with the system through structured forms for recording examination data and
by uploading  intraoral  photographs  and panoramic X-ray  images.  The  system  processes  these
inputs and utilizes dental object detection to identify dental conditions from radiographic images.
Finally,  it  generates exportable  PDF  dental charts for  documentation,  record-keeping, and
treatment planning.




## Document
## Name
IDRS_Proposal Owner TS, CA Page 20 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 3.2 Objectives

- To  develop  a  centralized  digital  dental  database  system  that  stores  and  manages  patient
examination history and dental charting data in a structured and accessible format.
- To improve clinical documentation efficiency and workflow by reducing manual recording
time and enabling seamless data entry through an intuitive user interface.
- To implement a dental object detection module for analyzing panoramic X-ray images and
identifying dental conditions such as dental caries, dental crowns, implants, and impacted
teeth
- To support clinical documentation and record-keeping by enabling the export of structured
dental charts as PDF documents for treatment planning and reporting.


3.3 Project scope

The scope of the Integrated Dental Record System covers the following:

- Developing a web-based dental record management platform
- Managing centralized patient profiles, including patient history and examination records
- Providing  digital  dental  charting  with  structured  clinical  forms  and  interactive  tooth
visualization
- Supporting  the  upload  and  management  of  intraoral  photographs  and  panoramic  X-ray
images linked to patient records
- Enabling historical baseline comparison and progress tracking across multiple patient visits
- Implementing dental object detection on panoramic X-ray images to suggest preliminary
dental conditions, subject to dentist review and confirmation
- Generating structured dental charts as exportable PDF documents for documentation and
treatment planning


## Document
## Name
IDRS_Proposal Owner TS, CA Page 21 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

3.4 Type of System Users and the Users’ Characteristics

- Dentist A  primary  user  responsible  for  conducting  patient  examinations  and  planning
treatments.  This  user  is  proficient  in  dental  terminology  and  clinical  procedures.  Within
the system, the user can:
- Create and manage patient profiles
- Record and review dental charting data
- Upload and view intraoral photographs and panoramic X-ray images
- Review AI-assisted dental condition suggestions from panoramic X-ray images
- Export completed dental charts as PDF documents


- Dental Assistants A secondary user who assists during patient examinations by recording
data  as  directed  by  the  dentist.  This  user  may  have  limited  familiarity  with  dental
terminology and technical terms. Within the system, the user can:
- Input examination data through structured digital forms
- Upload intraoral photographs and panoramic X-ray images
- Assist in completing dental charts under the supervision of the dentist






## Document
## Name
IDRS_Proposal Owner TS, CA Page 22 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

3.5 Acronyms and Definitions

## 3.5.1 Acronyms
- AI  Artificial Intelligence
- API Application Programming Interface
- EMR Electronic Medical Record
- HTTP Hypertext Transfer Protocol
- JWT JSON Web Token
- PDF Portable Document Format
- UI User Interface

## 3.5.2 Definitions

## Term

## Definition
Panoramic X-ray A  wide-view  dental  radiograph  that  captures  all  teeth,  jawbones,  and
surrounding  structures  in  a  single  image;  the  primary  image  type
supported by the IDRS AI detection module
Intraoral Photo A close-up photograph taken inside the patient's mouth using a specialized
camera, used to document dental conditions and treatment progress
Dental Charting The process of systematically recording a patient's current dental status,
including  existing  conditions,  restorations,  and  missing  teeth,  using  a
standardized format
Dental Status The  recorded  condition  of  each  individual  tooth  in  the  patient's  mouth,
including presence, absence, restorations, or prosthetics
Dental Caries Tooth  decay  caused  by  bacterial  activity;  one  of  the  dental  conditions
targeted for detection by the AI module
Dental Filling A restorative material placed in a tooth to repair damage caused by decay
or fracture; one of the conditions detected by the AI module
Occlusal Analysis An  examination  of  how  the  upper  and  lower  teeth  come  together  when
biting, including the classification of bite relationship and contact points
Implant An  artificial  tooth  root  surgically  placed  into  the  jawbone  to  support  a
dental prosthesis




## Document
## Name
IDRS_Proposal Owner TS, CA Page 23 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 3.6 System Architecture


## Figure 12: System Architecture Diagram



## Document
## Name
IDRS_Proposal Owner TS, CA Page 24 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## Description:
The system architecture consists of three main components: the web application service (frontend),
backend service, and AI module, all integrated to support real-time clinical workflows.
- Web Application Service: The frontend is developed using Vite and React, providing an
interactive  user  interface  for  dentists  and  dental  assistants.  It  communicates  with  the
backend via HTTP requests using Axios, enabling seamless data exchange and real-time
updates during clinical operations.
- Backend  Service:  The  backend  is  implemented  using  FastAPI,  which  handles  business
logic, data processing, and JWT-based authentication. It manages patient and clinical data
through  Supabase  (PostgreSQL)  and  utilizes  Supabase  Storage  for  managing  intraoral
photographs  and  panoramic  X-ray  images.  The  backend  also  acts  as  an  intermediary
between the frontend and the AI module.
- AI  Module:  The  AI  component  is  powered  by  a  YOLO-based  object  detection  model.
Panoramic X-ray images are sent from the backend to the AI module for analysis, where
dental conditions such as caries, fillings, and missing teeth are detected. The results are
then  returned  to  the  backend  and  forwarded  to  the  frontend  for  visualization  and  user
confirmation.
- Authentication: User authentication is handled through Supabase Auth. Users are required
to register and log in before accessing the system. Upon successful authentication, secure
tokens are issued to authorize subsequent API requests between the frontend and backend.
This architecture enables a modular, scalable, and integrated system design that supports efficient
data management and AI-assisted dental diagnosis.



## Document
## Name
IDRS_Proposal Owner TS, CA Page 25 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 3.7 Product Features

## Feature 1: Authentication

Description: Allows users to securely register and log in before accessing the system. The system
verifies user identity and controls access to system functionalities based on authentication status.

## Actor: User
## Details:
- Users can register by providing their name, email, and password
- Users can log in using their registered email and password
- The  system  validates  credentials  via  Supabase  Auth  and  issues  a  JWT  token  upon
successful login
- Users can log out, which terminates the current session
- The system restricts access to all features until the user is authenticated.


## Feature 2: Patient Management

Description:  Allows users to  create,  manage,  and retrieve patient  profiles. Each  patient  profile
serves as a centralized record containing all associated clinical data.
## Actor: User
## Details:
- Users can create a new patient profile by providing basic information (e.g., name, sex,
age).
- Users can view and update existing patient profile information
- Users can search for patients by name
- Users can delete patient profiles from the system.
- Each patient profile displays all associated dental charts and uploaded images




## Document
## Name
IDRS_Proposal Owner TS, CA Page 26 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026


## Feature 3: Dental Charting
Description:  Allows  users  to  record  and  manage  patient  dental  examination  data  through
structured  digital  forms and  interactive charting tools. The  system  is  designed  to improve
efficiency and reduce errors during clinical documentation.
## Actor: User
## Details:
- Users can create a new dental chart for a patient
- Users can record patient history, including
o Chief Complaint
o Present Illness
o Medical History
o Current Medication
o Known Allergy
- Users  can  record  extraoral  and  intraoral  examination  findings  through  structured  forms
with selectable options
- Users can record esthetic evaluations, including facial analysis and dentofacial analysis
- Users can record dental status by interacting with a visual tooth chart
- Users can record occlusal analysis, including Angle’s classification and contact points
## Feature 4: Image Management
Description: Allows  users  to  upload,  organize,  and manage intraoral  photographs  and
panoramic X-ray images associated with each patient profile.
## Actor: User
## Details:
- Users can upload intraoral photographs and panoramic X-ray images to a patient profile
- Users can view uploaded images within each patient profile
- Users can delete images from the patient profile
- Images are categorized into intraoral photographs and panoramic X-ray images



## Document
## Name
IDRS_Proposal Owner TS, CA Page 27 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## Feature 5: X-ray Dental Condition Detection
Description: Allows  the  system  to  automatically  analyze  panoramic  X-ray  images  using  an  AI
model  to  detect  common  dental  conditions  and  provide  preliminary  suggestions.  The  detection
results are intended to assist clinical workflow and must be reviewed and confirmed by the dentist
before being recorded in the dental chart.
## Actor: Dentist
## Details:
- The  system  processes  uploaded  panoramic  X-ray  images  using  a  YOLO-based  object
detection model
- The system detects common dental conditions, including:
o Dental caries (tooth decay)
o Dental fillings
o Dental crowns
o Dental implants
o Missing teeth
o Impacted teeth
- Detection  results  are  presented  as  annotated  visual  overlays  (e.g.,  bounding  boxes  and
labels) on the X-ray image
- The system generates condition suggestions within the dental charting interface
- The dentist reviews, edits, and confirms the detected conditions before updating the patient
record

Feature 6: PDF Export
Description:   Allows   users   to generate structured dental   charts   as PDF documents for
documentation, reporting, and treatment planning.

## Actor: User

## Details:

- Users can export completed dental charts as PDF documents
- Exported PDFs follow a structured and standardized format
- PDFs include patient information, clinical findings, and charting data
- Generated documents can be used for record-keeping and treatment planning



## Document
## Name
IDRS_Proposal Owner TS, CA Page 28 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 3.8 Limits
- The  AI-assisted  dental  detection  feature  supports  only  panoramic  X-ray  images.  Other
types of dental radiographs, such as periapical and bitewing X-rays, are not supported in
the current system scope.
- The  AI  detection  module  focuses  on  identifying  general  dental  conditions  and  does  not
support detailed tooth surface-level analysis (e.g., buccal or lingual surfaces). As a result,
the  system  may  not  capture  fine-grained  clinical  details  required  for  comprehensive
diagnosis.
- The  model  demonstrates  an  approximate  accuracy  of  around  80%  for  common  dental
conditions  (e.g.,  dental  caries,  missing  teeth,  and  dental  implants)  under  standard  image
quality conditions.
- All AI-generated detection results are preliminary and must be reviewed and confirmed by
a  dentist  before  being  recorded  in  the  dental  chart.  The  system  does  not  perform
autonomous clinical decision-making.
- The performance of the AI model may vary depending on image quality, resolution, and
patient positioning in the panoramic X-ray, which may affect detection accuracy.


## 3.9 Deliverable Items
- Web-based Integrated Dental Record System (IDRS)
- Software Requirements Specification (SRS) Document
## 3. Presentation Slides
## 4. Demo Video




## Document
## Name
IDRS_Proposal Owner TS, CA Page 29 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## 3.10 Milestones


Phase 1 Proposal: 11 February 2026 – 10 April 2026 58 days
Phase 2 Progress I: 18 April 2026 – 26 June 2026 69 days
Phase 3 Progress II: 27 June 2026 – 21 August 2026 56 days
Phase 4 Final Progress: 22 August 2026 – 2 November 2026 72 days

## Phase 1. Proposal
11 February 2026 – 10 April 2026 → 58 days

## Task Start Date End Date Duration Responsibility
## Phase 1: Proposal
Interview & Gather Requirements 11 Feb 2026 28 Feb 2026 18 days TS, CA
Proposal Document 1 Mar 2026 24 Mar 2026 27 days TS, CA
Prepare Proposal Presentation 28 Mar 2026 29 Mar 2026 2 days TS, CA
Proposal Presentation 30 Mar 2026 10 Apr 2026 12 days TS, CA


## Figure 13: Phase 1 Milestone



## Document
## Name
IDRS_Proposal Owner TS, CA Page 30 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## Phase 2. Progress I
18 April 2026 – 26 June 2026 → 69 days

## Task Start Date End Date Duration Responsibility
## Phase 2: Progress I
Software Requirement Specification 18 Apr 2026 24 Apr 2026 7 days TS, CA
Design Document 25 Apr 2026 1 May 2026 7 days TS, CA
Setup Frontend and Backend 2 May 2026 8 May 2026 7 days TS, CA
Feature 1: Authentication 9 May 2026 13 May 2026 5 days TS, CA
Test Feature 1 14 May 2026 15 May 2026 2 days TS, CA
Feature 2: Patient Management 16 May 2026 22 May 2026 7 days TS, CA
Test Feature 2 23 May 2026 24 May 2026 2 days TS, CA
Feature 3: Dental Charting 25 May 2026 11 Jun 2026 18 days TS, CA
Test Feature 3 12 Jun 2026 14 Jun 2026 3 days TS, CA
Review and fix all features 15 Jun 2026 18 Jun 2026 4 days TS, CA
Prepare Progress I Presentation 19 Jun 2026 21 Jun 2026 3 days TS, CA
Progress I Presentation 22 Jun 2026 26 Jun 2026 5 days TS, CA


## Figure 14: Phase 2 Milestone


## Document
## Name
IDRS_Proposal Owner TS, CA Page 31 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

Phase 3. Progress II
27 June 2026 – 21 August 2026 → 56 days

## Task Start Date End Date Duration Responsibility
Phase 3: Progress II
Requirement Specification 27 Jun 2026 30 Jun 2026 4 days TS, CA
Design Document 1 Jul 2026 5 Jul 2026 5 days TS, CA
Feature 4: Image Management 6 Jul 2026 12 Jul 2026 7 days TS, CA
Test Feature 4 13 Jul 2026 14 Jul 2026 2 days TS, CA
Feature 5: AI Dental Object Detection 15 Jul 2026 3 Aug 2026 20 days TS, CA
Test Feature 5 4 Aug 2026 6 Aug 2026 3 days TS, CA
Review and fix all features 7 Aug 2026 12 Aug 2026 6 days TS, CA
Prepare Progress II Presentation 13 Aug 2026 16 Aug 2026 4 days TS, CA
Progress II Presentation 17 Aug 2026 21 Aug 2026 5 days TS, CA


## Figure 15: Phase 3 Milestone




## Document
## Name
IDRS_Proposal Owner TS, CA Page 32 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## Phase 4. Final Progress
22 August 2026 – 2 November 2026 → 72 days

## Task Start Date End Date Duration Responsibility
## Phase 4: Final Progress
Requirement Specification 22 Aug 2026 26 Aug 2026 5 days TS, CA
Design Document 27 Aug 2026 31 Aug 2026 5 days TS, CA
Feature 6: PDF Export 1 Sep 2026 7 Sep 2026 7 days TS, CA
Test Feature 6 8 Sep 2026 10 Sep 2026 3 days TS, CA
Review and fix all features 11 Sep 2026 21 Sep 2026 11 days TS, CA
Prepare SE Show Pro 22 Sep 2026 26 Sep 2026 5 days TS, CA
SE Show Pro 30 Sep 2026 30 Sep 2026 1 day TS, CA
Recheck Documents 1 Oct 2026 8 Oct 2026 8 days TS, CA
## Software  Requirement  Specification
(Final)
9 Oct 2026 15 Oct 2026 7 days TS, CA
Prepare Final Presentation 16 Oct 2026 18 Oct 2026 3 days TS, CA
Final Presentation 19 Oct 2026 2 Nov 2026 - TS, CA

## Figure 16: Phase 4 Milestone


## Document
## Name
IDRS_Proposal Owner TS, CA Page 33 / 33
## Document
## Type
## Proposal Release
## Date
## 24-4-2026 Print
## Date
## 24-4-2026

## Chapter Four | Reference

[1]  GoodNotes, "GoodNotes – Notes reimagined," GoodNotes, [Online]. Available:
https://www.goodnotes.com.
[2]  Henry Schein One., "Dentrix Ascend: Cloud-based dental practice management software.," Dentrix,
[Online]. Available: https://www.dentrixascend.com.
[3]  AvvaStyle, "iDentist – Dental practice management software," AvvaStyle, [Online]. Available:
https://avvastyle.com/identist.html.
[4]  Curve Dental., "Curve Dental: All-in-one dental software solution.," Curve Dental., [Online].
Available: https://www.curvedental.com.
[5]  GitHub, "GitHub: Let's build from here.," GitHub, Inc., [Online]. Available:
https://www.github.com.
[6]  Docker, Inc., "Docker: Accelerated container application development.," [Online]. Available:
https://www.docker.com.
[7]  Supabase, Inc., "Supabase: The open source Firebase alternative.," [Online]. Available:
https://www.supabase.com. [Accessed 15 March 2026].
[8]  Roboflow, Inc., "Roboflow: Computer vision developer tools.," [Online]. Available:
https://www.roboflow.com.
[9]  Meta Open Source., "React: The library for web and native user interfaces.," [Online]. Available:
https://www.react.dev.
[10]  Vite., "Vite: Next generation frontend tooling.," [Online]. Available: https://www.vitejs.dev.
[11]  Tailwind CSS., "Tailwind CSS: A utility-first CSS framework.," [Online]. Available:
https://www.tailwindcss.com.
[12]  Shadcn/ui., " shadcn/ui: Build your component library.," [Online]. Available: https://ui.shadcn.com.
[13]  React PDF. , "React-PDF: Display PDFs in your React app as easily as if they were images.," 2026.
[Online]. Available: https://www.npmjs.com/package/react-pdf.
[14]  Axios, "Axios: Promise based HTTP client for the browser and Node.js.," [Online]. Available:
https://www.axios-http.com.
[15]  Tiangolo, S. , "FastAPI: Web framework for building APIs with Python.," [Online]. Available:
https://www.fastapi.tiangolo.com.
[16]  PostgreSQL Global Development Group., "PostgreSQL: The world's most advanced open source
relational database.," [Online]. Available: https://www.postgresql.org.
[17]  Ultralytics. , "YOLO: The latest version of YOLO.," [Online]. Available:
https://www.ultralytics.com/yolo.


