import React from 'react';
import { Outlet } from 'react-router-dom';
<<<<<<< HEAD
import ThemeSwitcher from '@renderer/components/ui/ThemeSwitcher';
=======
import { ThemeSwitcher } from '../ui';
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)

import {
  AuthContainer,
  AuthBanner,
  BannerContent,
  BannerTitle,
  BannerDescription,
  FormSection,
  FormContainer,
  Logo,
  ThemeToggle
} from './AuthLayout.style';

const AuthLayout: React.FC = () => {
  return (
    <AuthContainer>
      <AuthBanner>
        <BannerContent>
          <BannerTitle>Project Manager</BannerTitle>
          <BannerDescription>
            Organizza i tuoi progetti, gestisci le attività e tieni traccia dei progressi con il nostro strumento completo di gestione progetti.
          </BannerDescription>
        </BannerContent>
      </AuthBanner>
<<<<<<< HEAD

=======
      
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)
      <FormSection>
        <Logo>PM App</Logo>
        <ThemeToggle>
          <ThemeSwitcher />
        </ThemeToggle>
<<<<<<< HEAD

=======
        
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management)
        <FormContainer>
          <Outlet />
        </FormContainer>
      </FormSection>
    </AuthContainer>
  );
};

export default AuthLayout;
