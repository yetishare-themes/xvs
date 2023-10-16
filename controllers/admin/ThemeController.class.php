<?php

namespace Themes\Xvs\Controllers\Admin;

use App\Core\Database;
use App\Helpers\UserActionLogHelper;
use App\Models\Theme;
use App\Controllers\Admin\ThemeController AS CoreThemeController;
use App\Helpers\AdminHelper;
use App\Helpers\CoreHelper;
use App\Helpers\ThemeHelper;

class ThemeController extends CoreThemeController
{
    public function themeSettings() {
        // admin restrictions
        $this->restrictAdminAccess();
        
        // pickup request
        $db = Database::getDatabase();
        $request = $this->getRequest();

        // load themes details
        $themeFolder = basename(dirname(dirname(__DIR__)));
        $themes = $db->getRow("SELECT * "
                . "FROM theme "
                . "WHERE folder_name = :folder_name "
                . "LIMIT 1", array(
                    'folder_name' => $themeFolder,
                ));
        if (!$themes) {
            return $this->redirect(ADMIN_WEB_ROOT . '/theme_manage?error=' . urlencode('There was a problem loading the theme details.'));
        }

        // load themes details
        $themeObj = ThemeHelper::getInstance($themes['folder_name']);
        $themeDetails = ThemeHelper::themeSpecificConfiguration($themes['folder_name']);
        $themeConfig = $themeDetails['config'];

        // pre-load all site skins
        $skinsPath = dirname(dirname(__DIR__)).'/assets/styles/skins/';
        $skins = CoreHelper::getDirectoryListing($skinsPath);
        sort($skins);

        // prep into array
        $skinsArr = [];
        foreach($skins AS $option) {
            $skinsArr[] = str_replace($skinsPath, '', $option);
        }
        
        // pre-load all front end site skins
        $frontEndSkinsPath = dirname(dirname(__DIR__)).'/assets/frontend/css/theme/';
        $frontEndSkins = CoreHelper::getDirectoryListing($frontEndSkinsPath);
        sort($frontEndSkins);
        
        // prep into array
        $frontEndskinsArr = [];
        foreach($frontEndSkins AS $option) {
            $frontEndskinsArr[] = str_replace($frontEndSkinsPath, '', $option);
        }

        // load existing settings
        if (strlen($themes['theme_settings'])) {
            $theme_settings = json_decode($themes['theme_settings'], true);
            if ($theme_settings) {
                $site_skin = $theme_settings['site_skin'];
                $front_end_site_skin = $theme_settings['front_end_site_skin'];
                $css_code = $theme_settings['css_code'];
                $head_js_code = $theme_settings['head_js_code'];
            }
        }

        // make sure the logo directory path exists
        $logoStorageFolder = CACHE_DIRECTORY_ROOT . '/themes/' . $themeFolder;
        $logoStorageUrl = CACHE_WEB_ROOT . '/themes/' . $themeFolder;
        if (!file_exists($logoStorageFolder)) {
            mkdir($logoStorageFolder, 0777, true);
        }
        
        // check permissions
        if(!is_writable($logoStorageFolder)) {
            AdminHelper::setError('Logo storage folder is not writable - '.$logoStorageFolder);
        }

        // handle page submissions
        if($request->request->has('submitted') && AdminHelper::isErrors() == false) {
            // get variables
            $oldThemeSettings = json_decode($themes['theme_settings'], true);
            $site_skin = $request->request->get('site_skin');
            $front_end_site_skin = $request->request->get('front_end_site_skin');
            $css_code = $request->request->get('css_code');
            $head_js_code = $request->request->get('head_js_code');

            // validate submission
            if ($this->inDemoMode()) {
                AdminHelper::setError(AdminHelper::t("no_changes_in_demo_mode"));
            }

            if (!AdminHelper::isErrors()) {
                if (isset($_FILES['site_logo']) && strlen($_FILES['site_logo']['tmp_name'])) {
                    // check it's an image
                    if ($themeObj->isPng($_FILES['site_logo']['tmp_name']) === false) {
                        AdminHelper::setError('Logo does not appear to be a PNG image. Please check and try again.');
                    }
                    elseif ($_FILES['site_logo']['size'] > 200000) {
                        AdminHelper::setError('Logo is bigger than 200k in size, please reduce and try again.');
                    }
                }

                if (isset($_FILES['site_logo_inverted']) && strlen($_FILES['site_logo_inverted']['tmp_name'])) {
                    // check it's an image
                    if ($themeObj->isPng($_FILES['site_logo_inverted']['tmp_name']) === false) {
                        AdminHelper::setError('Logo does not appear to be a PNG image. Please check and try again.');
                    }
                    elseif ($_FILES['site_logo_inverted']['size'] > 200000) {
                        AdminHelper::setError('Logo is bigger than 200k in size, please reduce and try again.');
                    }
                }
            }

            // update the settings
            if (!AdminHelper::isErrors()) {
                // compile new settings
                $settingsArr = [];
                $settingsArr['thumbnail_type'] = 'square';
                $settingsArr['site_skin'] = $site_skin;
                $settingsArr['front_end_site_skin'] = $front_end_site_skin;
                $settingsArr['css_code'] = $css_code;
                $settingsArr['head_js_code'] = $head_js_code;
                $settings = json_encode($settingsArr);

                // update
                $theme = Theme::loadOneById($themes['id']);
                $theme->theme_settings = $settings;
                $theme->save();

                // move logo into storage
                if (isset($_FILES['site_logo']) && strlen($_FILES['site_logo']['tmp_name'])) {
                    $targetFile = $logoStorageFolder . '/logo.png';
                    move_uploaded_file($_FILES['site_logo']['tmp_name'], $targetFile);
                }

                if (isset($_FILES['site_logo_inverted']) && strlen($_FILES['site_logo_inverted']['tmp_name'])) {
                    $targetFile = $logoStorageFolder . '/logo_inverse.png';
                    move_uploaded_file($_FILES['site_logo_inverted']['tmp_name'], $targetFile);
                }

                // create custom css file
                $cssCodeFile = CACHE_DIRECTORY_ROOT . '/themes/' . $themeFolder . '/custom_css.css';
                if (strlen($settingsArr['css_code'])) {
                    file_put_contents($cssCodeFile, $settingsArr['css_code']);
                }
                else {
                    unlink($cssCodeFile);
                }

                // clear cache
                ThemeHelper::clearCachedThemeSettings();

                // update theme config cache
                ThemeHelper::loadThemeConfigurationFiles(true);

                // user action logs
                UserActionLogHelper::logAdmin('Edited theme settings', 'ADMIN', 'UPDATE', [
                    'data' => UserActionLogHelper::getChangedData($oldThemeSettings, $settingsArr),
                ]);

                AdminHelper::setSuccess('Theme settings updated.');
            }
        }

        // load template
        return $this->render('admin/theme_settings.html', array(
                    'mainLogoUrl' => $themeObj->getMainLogoUrl(),
                    'inverseLogoUrl' => $themeObj->getInverseLogoUrl(),
                    'skinsArr' => $skinsArr,
                    'frontEndskinsArr' => $frontEndskinsArr,
                    'css_code' => $css_code,
                    'head_js_code' => $head_js_code,
                    'site_skin' => $site_skin,
                    'front_end_site_skin' => $front_end_site_skin,
                                ));
    }

}
