import { Tabs } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { Avatar, Button, Popover, useTheme } from '@geist-ui/react';
import { Sun, Moon, Settings } from '@geist-ui/react-icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

const MenuLinks: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  return (
    <>
      <div className="submenu__wrapper">
        <div className="submenu__inner">
          <Tabs value={router.asPath} onChange={(r) => router.push(r)}>
            <Tabs.Item label="Home" value="/" />
          </Tabs>
        </div>
      </div>
      <style jsx>{`
        .submenu__wrapper {
          height: 48px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 -1px ${theme.palette.border};
        }
        .submenu__inner {
          display: flex;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          height: 48px;
          box-sizing: border-box;
          overflow-y: hidden;
          overflow-x: auto;
          overflow: -moz-scrollbars-none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          box-sizing: border-box;
        }
        .submenu__inner :global(.content) {
          display: none;
        }
        .submenu__inner :global(.tabs),
        .submenu__inner :global(header) {
          height: 100%;
          border: none;
        }
        .submenu__inner :global(.tab) {
          height: calc(100% - 2px);
          padding-top: 0;
          padding-bottom: 0;
          color: ${theme.palette.accents_5};
          font-size: 0.875rem;
        }
        .submenu__inner :global(.tab):hover {
          color: ${theme.palette.foreground};
        }
        .submenu__inner :global(.active) {
          color: ${theme.palette.foreground};
        }
      `}</style>
    </>
  );
};

type PopoverSettingsProps = {
  session: Session | null;
  loading: boolean;
  switchTheme: () => void;
};

const PopoverSettings: React.FC<PopoverSettingsProps> = ({ session, loading, switchTheme }: PopoverSettingsProps) => {
  const signInHandler = () => signIn('cognito', { callbackUrl: window.location.origin });
  const signOutHandler = () => signOut();
  const { type: themeType } = useTheme();
  const iconTheme = themeType === 'light' ? <Moon /> : <Sun />;
  const router = useRouter();
  return (
    <>
      <Popover.Item title>User Settings</Popover.Item>
      <Popover.Item title>
        <Button onClick={switchTheme} iconRight={iconTheme} auto scale={2 / 3} px={0.6}>
          {themeType} Mode
        </Button>
      </Popover.Item>
      <Popover.Item title line={false}>
        <Button onClick={() => router.push('/settings')} iconRight={<Settings />} auto scale={2 / 3} px={0.6}>
          Settings
        </Button>
      </Popover.Item>
      <Popover.Item>
        {session && !loading ? (
          <Button onClick={signOutHandler}>Sign Out</Button>
        ) : (
          <Button onClick={signInHandler}>Sign In</Button>
        )}
      </Popover.Item>
    </>
  );
};

type HeaderProps = {
  switchThemes: () => void;
};

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const theme = useTheme();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const iconTheme = theme.type === 'light' ? <Moon /> : <Sun />;
  return (
    <>
      <nav className="nav_menu">
        <h1 className="title">Serverless NextJS Dashboard</h1>
        <div className="settings">
          <Button
            className="theme-switcher"
            onClick={props.switchThemes}
            icon={iconTheme}
            type="abort"
            auto
            scale={2 / 3}
            px={0.6}
          />
          <Popover
            placement="bottomEnd"
            content={<PopoverSettings session={session} loading={loading} switchTheme={props.switchThemes} />}
          >
            <Avatar text="OA" />
          </Popover>
        </div>
      </nav>
      <MenuLinks />
      <style global jsx>{`
        .nav_menu {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: ${theme.layout.pageWidthWithMargin};
          height: 54px;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          background-color: ${theme.palette.background};
          font-size: 16px;
          box-sizing: border-box;
        }
        .theme-switcher {
          margin-right: 7px;
        }
        .settings {
          display: flex;
          align-items: center;
          margin: 15px;
        }
        .title {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0;
        }
      `}</style>
    </>
  );
};

export default Header;
