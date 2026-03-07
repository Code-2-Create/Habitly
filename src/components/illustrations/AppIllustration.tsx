import React from 'react';
import journeyLogin from '../../assets/illustrations/journey-login.svg';
import journeySignup from '../../assets/illustrations/journey-signup.svg';
import emptyDashboard from '../../assets/illustrations/empty-dashboard.svg';
import streakAchievement from '../../assets/illustrations/streak-achievement.svg';

type IllustrationVariant =
  | 'login'
  | 'signup'
  | 'emptyDashboard'
  | 'streakAchievement';

interface AppIllustrationProps {
  variant: IllustrationVariant;
  alt: string;
  className?: string;
}

const illustrationMap: Record<IllustrationVariant, string> = {
  login: journeyLogin,
  signup: journeySignup,
  emptyDashboard,
  streakAchievement,
};

const AppIllustration: React.FC<AppIllustrationProps> = ({ variant, alt, className }) => {
  return (
    <img
      src={illustrationMap[variant]}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
};

export default AppIllustration;
