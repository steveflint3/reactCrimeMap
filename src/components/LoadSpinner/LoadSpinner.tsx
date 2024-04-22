import React from 'react'
import styles from './LoadSpinner.module.scss'

const LoadSpinner = (): React.JSX.Element =>
  <div className={styles.loadingScreen} >
    <div className={styles.wrapper}>
      <div className={styles.spinner}>
        <div data-testid='yearLabel' className={styles.content}>Loading...</div>
      </div>
    </div>
  </div>

export default LoadSpinner
