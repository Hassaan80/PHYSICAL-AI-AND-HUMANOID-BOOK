import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Physical & Humanoid AI"
      description="A website exploring robotics, digital twins, VLA, and humanoid intelligence"
    >
      <main className={styles.hero}>
        <div className={styles.overlay} />

        <div className={styles.content}>
          <h1 className={styles.title}>PHYSICAL & HUMANOID AI</h1>
          <p className={styles.subtitle}>
            Exploring the future of robotics intelligence — practical, physical, and humanoid systems.
          </p>

          <div className={styles.buttonColumn}>

            <Link className={styles.navButton} to="/docs/robotics/ros2-nervous-system/intro">
              <span className={styles.btnLabel}>The Robotic Nervous System (ROS 2)</span>
              <span className={styles.btnMeta}>Middleware, components, and comms</span>
            </Link>

            <Link className={styles.navButton} to="/docs/robotics/ros2-nervous-system/intro">
              <span className={styles.btnLabel}>The Digital Twin (Gazebo & Unity)</span>
              <span className={styles.btnMeta}>Simulated environments & sync</span>
            </Link>

            <Link className={styles.navButton} to="/docs/nvidia-isaac-ai-module/chapter-1">
              <span className={styles.btnLabel}>NVIDIA Isaac AI-Robot Brain</span>
              <span className={styles.btnMeta}>Deep robot control & simulation</span>
            </Link>

            <Link className={styles.navButton} to="/docs/vla-humanoid-ai-module/chapter-1">
              <span className={styles.btnLabel}>Vision-Language-Action (VLA)</span>
              <span className={styles.btnMeta}>Perception, language, and motor plans</span>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}