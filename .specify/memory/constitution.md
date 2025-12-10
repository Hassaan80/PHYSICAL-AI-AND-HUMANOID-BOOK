<!--
Sync Impact Report:
Version change: [CONSTITUTION_VERSION] (old) → 0.1.0 (new)
List of modified principles:
  - Technical accuracy
  - Educational clarity (CS/AI students)
  - Reproducibility
  - Spec-driven development
  - Embodied intelligence focus
Added sections: None
Removed sections:
  - Principle 6
  - Standard 6
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending
  - .specify/templates/spec-template.md ⚠ pending
  - .specify/templates/tasks-template.md ⚠ pending
  - .specify/templates/commands/*.md ⚠ pending
  - README.md ⚠ pending
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original adoption date unknown
-->
# Project Constitution: Physical AI & Humanoid Robotics — AI/Spec-Driven Book + Integrated RAG Chatbot

## 1. Introduction
This document outlines the core principles, deliverables, and governance for the "Physical AI & Humanoid Robotics — AI/Spec-Driven Book + Integrated RAG Chatbot" project.

## 2. Project Overview

### 2.1. Deliverables
- Technical book built with Docusaurus, using Spec-Kit Plus and Claude Code, deployed on GitHub Pages.
- Embedded RAG chatbot using OpenAI Agents/ChatKit, FastAPI, Neon Postgres, Qdrant Cloud with full-book and selected-text-only QA.

### 2.2. Scope (Mandatory Inclusions)
- Module 1: ROS 2, Nodes, Topics, Services, rclpy, URDF
- Module 2: Gazebo & Unity, Physics, Sensors (LiDAR, Depth, IMU)
- Module 3: NVIDIA Isaac, Isaac ROS, VSLAM, Nav2
- Module 4: Vision-Language-Action, Whisper, LLM → ROS 2
- Capstone: Fully autonomous humanoid (voice → navigate → detect → manipulate)

## 3. Core Principles

### 3.1. Technical accuracy
All technical content MUST be rigorously fact-checked and reflect current best practices and validated research in the fields of AI, robotics, and software engineering.

### 3.2. Educational clarity (CS/AI students)
Content MUST be structured and written to be accessible and understandable by Computer Science and Artificial Intelligence students, with clear explanations, examples, and progressive complexity.

### 3.3. Reproducibility
All code examples, experiments, and results presented in the book MUST be reproducible by readers following the provided instructions and environment setups.

### 3.4. Spec-driven development
Development of both the book and the RAG chatbot components MUST adhere to a specification-driven approach, ensuring features are well-defined, testable, and meet explicit requirements.

### 3.5. Embodied intelligence focus
The primary thematic focus MUST remain on embodied AI, specifically its application to humanoid robotics, emphasizing real-world interaction and perception.

## 4. Key Standards

### 4.1. All claims source-traceable
Every factual claim and assertion made within the book MUST be traceable to its original source, with clear citations provided.

### 4.2. APA citation style
All references and citations MUST conform to the latest APA (American Psychological Association) citation style guidelines.

### 4.3. 50%+ authoritative technical sources
A minimum of 50% of all cited sources MUST originate from peer-reviewed journals, conference proceedings, academic books, or recognized industry standards bodies.

### 4.4. 0% plagiarism tolerance
The project maintains a strict zero-tolerance policy for plagiarism. All content MUST be original or properly quoted and attributed.

### 4.5. Flesch-Kincaid 11–13
The readability of the book's prose, as measured by the Flesch-Kincaid Grade Level score, MUST fall between grades 11 and 13 to ensure appropriate academic accessibility.

## 5. RAG Standards

### 5.1. Full-book QA + selected-text-only mode
The RAG chatbot MUST support querying over the entire book content and also provide a mode for answering questions based only on user-selected text passages.

### 5.2. Source-grounded answers only
The RAG chatbot MUST exclusively generate answers that are directly verifiable and derivable from the provided source material, avoiding ungrounded responses.

### 5.3. Hallucination control
Robust measures MUST be implemented to minimize and detect AI hallucination in chatbot responses, with mechanisms to flag or retract unverified information.

## 6. Constraints
- The book content MUST be between 8,000 and 15,000 words.
- A minimum of 20 verified and authoritative sources MUST be cited.
- The final output MUST be available in both web (GitHub Pages) and PDF formats.
- The project, including source code and documentation, MUST be publicly deployed on GitHub.

## 7. Success Criteria
- A live, publicly accessible book on GitHub Pages, reflecting all approved content.
- An embedded, fully functional RAG chatbot capable of answering questions as per the RAG standards.
- A fully functional simulated autonomous humanoid capable of executing the defined capstone tasks (voice interaction, navigation, object detection, manipulation).
- All claims within the book are validated, and the project demonstrates zero instances of plagiarism.

## 8. Governance

### 8.1. Versioning
- **Constitution Version**: 0.1.0
- **Ratification Date**: TODO(RATIFICATION_DATE): Original adoption date unknown
- **Last Amended Date**: 2025-12-07

### 8.2. Amendment Procedure
Any proposed amendments to this constitution MUST be submitted as a pull request to the project's governance repository. Amendments require approval from a majority of designated project leads.

### 8.3. Compliance Review
Compliance with the principles and standards outlined in this constitution will be reviewed quarterly by the project leads. Deviations MUST be documented and addressed with a clear action plan.
