import React from 'react';
import { TwReveal } from '@/components/dsm';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { ABOUT } from '@/content/site/about';
import { CERTIFICATIONS, EDUCATION, SKILL_GROUPS } from './aboutData';
import styles from './CredentialsSection.module.scss';

/** The meters get crowded past a dozen rows; the tail is all 90%+ anyway. */
const PROFICIENCY = ABOUT_SKILLS.slice(0, 12);

/**
 * Skills, degrees, and certifications: the design that was on TEST (owner,
 * #294), unchanged, now laid out across the full section width instead of
 * beside the books image. Skill groups, proficiency meters, then degrees and
 * certifications side by side.
 */
export function CredentialsBody() {
  return (
    <>
      <div className={styles.skillGroups}>
        {SKILL_GROUPS.map((group, i) => (
          <TwReveal fill key={group.title} delay={i * 90}>
            <div className={styles.skillGroup}>
              <h3 className={styles.skillGroupTitle}>{group.title}</h3>
              <ul className={styles.skillList}>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </TwReveal>
        ))}
      </div>

      <TwReveal>
        <p className={styles.chipLabel}>{ABOUT.credentials.proficiency}</p>
        <div className={styles.meterGrid}>
          {PROFICIENCY.map((skill) => (
            <div key={skill.name}>
              <div className={styles.meterHead}>
                <span className={styles.meterName}>{skill.name}</span>
                <span className={styles.meterValue}>{skill.percentage}%</span>
              </div>
              <div
                className={styles.meterTrack}
                role='meter'
                aria-valuenow={skill.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={skill.name}
              >
                <span
                  className={styles.meterFill}
                  style={
                    {
                      '--tw-meter-pct': skill.percentage / 100,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </TwReveal>

      <div className={styles.credGrid}>
        <TwReveal>
          <h3 className={styles.credHeading}>{ABOUT.credentials.degrees}</h3>
          <ul className={styles.credList}>
            {EDUCATION.map((item) => (
              <li key={item.credential}>
                <p className={styles.credName}>{item.credential}</p>
                <p className={styles.credMeta}>
                  {item.school} · {item.year}
                </p>
              </li>
            ))}
          </ul>
        </TwReveal>

        <TwReveal delay={90}>
          <h3 className={styles.credHeading}>
            {ABOUT.credentials.certifications}
          </h3>
          <ul className={styles.certList}>
            {CERTIFICATIONS.map((cert) => (
              <li key={cert.name} className={styles.certItem}>
                <span className={styles.certName}>{cert.name}</span>
                <span className={styles.certYear}>{cert.year}</span>
              </li>
            ))}
          </ul>
        </TwReveal>
      </div>
    </>
  );
}

export default CredentialsBody;
