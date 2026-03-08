import React from 'react';
import loginIllustration from '../../assets/illustrations/login.webp';
import signinIllustration from '../../assets/illustrations/signin.webp';
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
  login: loginIllustration,
  signup: signinIllustration,
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
