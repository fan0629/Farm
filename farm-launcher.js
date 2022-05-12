/**
 * Alipay ant forest intelligent collection script launcher
 * @since Nov 1, 2021
 * @version 2.2.2
 * @author SuperMonster003
 * @see https://github.com/SuperMonster003/Ant-Forest
 */

let {
    $$toast, $$und, $$obj, $$arr, $$cvt, $$bool, $$func,
    $$num, $$sleep, $$impeded, $$str, $$link, isNullish,
} = require('./modules/mod-global');
let {uix} = require('./modules/ext-ui');
let {appx} = require('./modules/ext-app');
let {db} = require('./modules/mod-database');
let {filesx} = require('./modules/ext-files');
let {alipay} = require('./modules/mod-alipay');
let {autojs} = require('./modules/mod-autojs');
let {cryptox} = require('./modules/ext-crypto');
let {imagesx} = require('./modules/ext-images');
let {timersx} = require('./modules/ext-timers');
let {colorsx} = require('./modules/ext-colors');
let {eventsx} = require('./modules/ext-events');
let {project} = require('./modules/mod-project');
let {dialogsx} = require('./modules/ext-dialogs');
let {threadsx} = require('./modules/ext-threads');
let {enginesx} = require('./modules/ext-engines');
let {consolex} = require('./modules/ext-console');
let {pluginsx} = require('./modules/ext-plugins');
let {storagesx} = require('./modules/ext-storages');
let {a11yx, $$sel} = require('./modules/ext-a11y');
let {devicex, $$disp} = require('./modules/ext-device');
let common = require("./modules/工具方法");

let $$init = {
    check() {
        devicex.ensureSdkInt();
        autojs.ensureVersion();
        appx.checkAlipayPackage();
        appx.checkScreenOffTimeout();
        appx.checkAccessibility();

        return $$init;
    },
    global() {
        setGlobalObjects();
        setGlobalFlags();
        setGlobalLog();

        consolex.__();
        consolex._('开发者测试日志已启用', 0, 0, -2);
        consolex._('设备型号: ' + device.brand + '\x20' + device.product);

        $$disp.debug();

        appSetter().setTask().setLayout();

        consolex._('Auto.js版本: ' + $$app.autojs_ver_name);
        consolex._('项目版本: ' + $$app.project_ver_name);
        consolex._('安卓SDK版本: ' + device.sdkInt);
        consolex._('安卓系统版本: ' + device.release);
        consolex._('Root权限: ' + ($$app.has_root ? '已获取' : '未获取'));

        return $$init;

        // tool function(s) //

        function setGlobalObjects() {
            global.$$flag = {
                autojs_has_root: appx.hasRoot(),
                autojs_has_secure: appx.hasSecure(),
            };

            global.$$cfg = Object.assign({},
                storagesx['@default'].af,
                storagesx.af_cfg.get('config'));

            global.$$db = db.create('af', {alter_type: 'union'});

            global.$$app = {
                developer: String.unTap('434535154232343343441542000003'),
                rl_title: String.unEsc('2615FE0F0020597D53CB6392884C699C'),
                task_name: "\"芭芭农场\"",
                autojs_name: autojs.getAppName(),
                autojs_pkg: autojs.getPkgName(),
                autojs_ver_name: autojs.getVerName(),
                project_ver_name: project.getLocalVerName(),
                init_scr_on: devicex.is_init_screen_on,
                init_fg_pkg: currentPackage(),
                engines_exec_argv: enginesx.my_engine_exec_argv,
                cwd: enginesx.cwd,
                cwp: enginesx.cwp,
                has_root: $$flag.autojs_has_root,
                root_fxs: $$cfg.root_access_functions,
                fri_drop_by: {
                    _pool: [],
                    _max: 5,
                    ic(name) {
                        let _ctr = this._pool[name] || 0;
                        if (_ctr === this._max) {
                            consolex._('发送排行榜复查停止信号');
                            consolex._('已达连续好友访问最大阈值');
                            $$flag.rl_review_stop = true;
                        }
                        this._pool[name] = ++_ctr;
                    },
                    dc(name) {
                        let _ctr = this._pool[name] || 0;
                        this._pool[name] = _ctr > 1 ? --_ctr : 0;
                    },
                },
                get now() {
                    return new Date();
                },
                get ts() {
                    return Date.now();
                },
                get ts_sec() {
                    return Date.now() / 1e3 >> 0;
                },
                exit() {
                    try {
                        this.layout.closeAll();
                        floaty.closeAll(); // just in case

                        if (this.queue.excl_tasks_all_len > 1) {
                            consolex._('移除当前脚本广播监听器');
                            events.broadcast.removeAllListeners();
                            consolex._('发送初始屏幕开关状态广播');
                            events.broadcast.emit('init_scr_on_state_change', this.init_scr_on);
                        }
                    } catch (e) {
                        console.error(e + '\n' + e.stack);
                    } finally {
                        consolex.$((this.task_name || '"Unknown"') + '任务结束', 1, 0, 0, '2n');

                        // exit() might cause ScriptInterruptedException
                        // as $$app.exit might invoked within Promise
                        ui.post(exit);
                    }
                },
                /**
                 * @param {*} [status] - a truthy value indicates abnormal termination
                 */
                tidy(status) {
                    let _status = status ? 1 : 0;

                    this.monitor.insurance.finish(_status);

                    dialogsx.clearPool();
                    imagesx.clearPool();
                    $$db.close();

                    $$flag.glob_e_scr_privilege = true;
                },
            };

            $$sel.add('af', ['芭芭农场', {isAlipay: true}])
                .add('alipay_home', [/首页|Homepage/, {bi$: [0, cY(0.7), W, H], isAlipay: true}])
                .add('af_title', [/蚂蚁森林|Ant Forest/, {bi$: [0, 0, cX(0.4), cY(0.2)], isAlipay: true}])
                .add('af_home', [/合种|背包|通知|攻略|任务|.*大树养成.*/, {isAlipay: true}])
                .add('energy_amt', [/^\s*\d+(\.\d+)?(k?g|t)\s*$/, {isAlipay: true}])
                .add('rl_title', [$$app.rl_title, {isAlipay: true}])
                .add('rl_ent', [/查看更多好友|View more friends/, {isAlipay: true}])
                .add('rl_end_idt', [/.*没有更多.*/, {isAlipay: true}])
                .add('list', [className('ListView'), {isAlipay: true}])
                .add('fri_tt', [/.+的蚂蚁森林/, {bi$: [0, 0, cX(0.95), cY(0.2)], isAlipay: true}])
                .add('cover_used', [/.*使用了.*保护罩.*/, {isAlipay: true}])
                .add('wait_awhile', [/.*稍等片刻.*/, {isAlipay: true}])
                .add('reload_frst_page', ['重新加载', {isAlipay: true}])
                .add('close_btn', [/关闭|Close/, {isAlipay: true}])
                .add('login_btn', [/登录|Log in|.*loginButton/, {isAlipay: true}])
                .add('login_new_acc', [/换个新账号登录|[Aa]dd [Aa]ccount/, {isAlipay: true}])
                .add('login_other_acc', [/换个账号登录|.*switchAccount/, {isAlipay: true}])
                .add('login_other_mthd_init_pg', [/其他登录方式|Other accounts/, {isAlipay: true}])
                .add('login_other_mthd', [/换个方式登录|.*[Ss]w.+[Ll]og.+thod/, {isAlipay: true}])
                .add('login_by_code', [/密码登录|Log ?in with password/, {isAlipay: true}])
                .add('login_next_step', [/下一步|Next|.*nextButton/, {isAlipay: true}])
                .add('input_username', {
                    className: 'EditText',
                    filter: w => /(会员|用户)名|手机|邮箱/.test($$sel.pickup(w, 'txt')),
                    isAlipay: true,
                })
                .add('input_password', () => {
                    if ($$sel.pickup(/.*(忘记密码|输入.*密码).*/)) {
                        let wc = $$sel.pickup({className: 'EditText', isAlipay: true}, 'wc');
                        return wc.length ? wc[wc.length - 1] : null;
                    }
                    return null;
                })
                .add('switch_to_other_acc', {
                    idMatches: /.+_item_account/,
                    isAlipay: true,
                })
                .add('login_err_ensure', idMatches(/.*ensure/))
                .add('login_err_msg', (type) => {
                    let _t = type || 'txt';
                    return $$sel.pickup([id('com.alipay.mobile.antui:id/message'), {isAlipay: true}], _t)
                        || $$sel.pickup([$$sel.get('login_err_ensure'), {isAlipay: true}, 'p2c0>0>0'], _t);
                })
                .add('acc_logged_out', [new RegExp('.*('
                    + /在其他设备登录|logged +in +on +another/.source + '|'
                    + /.*账号于.*通过.*登录.*|account +logged +on +to/.source + ').*'), {
                    isAlipay: true,
                }]);
        }

        function setGlobalFlags() {
            let _dbg_info_sw = $$cfg.debug_info_switch;
            let _msg_sw = $$cfg.message_showing_switch;
            let _console_msg_sw = _msg_sw && $$cfg.console_log_switch;

            $$flag.show_debug_info = _dbg_info_sw && _console_msg_sw;
            $$flag.show_energy_result = _msg_sw && $$cfg.result_showing_switch;
            $$flag.show_floaty_result = $$cfg.floaty_result_switch;

            _console_msg_sw ? consolex.print.enable() : consolex.print.disable();

            let _e_argv = $$app.engines_exec_argv;
            if (Object.size(_e_argv, {exclude: 'intent'}) > 0) {
                if (!$$und(_e_argv.is_debug)) {
                    $$flag.show_debug_info = Boolean(_e_argv.is_debug);
                }
                if ($$und(_e_argv.is_instant_running)) {
                    _e_argv.is_instant_running = true;
                }
                if ($$und(_e_argv.no_insurance)) {
                    _e_argv.no_insurance = true;
                }
            }
        }

        function setGlobalLog() {
            $$cfg.aj_global_log_switch && consolex.setGlobalLogConfig({
                file: $$cfg.aj_global_log_cfg_path + 'auto.js-log.log',
                filePattern: $$cfg.aj_global_log_cfg_file_pattern,
                maxBackupSize: $$cfg.aj_global_log_cfg_max_backup_size,
                maxFileSize: $$cfg.aj_global_log_cfg_max_file_size << 10,
            });
            consolex.debug.switchSet($$flag.show_debug_info);
        }

        function appSetter() {
            return {
                setTask() {
                    /**
                     * @param {number} du_minute
                     * @param {{is_toast?: boolean, is_async?: boolean}} [options]
                     */
                    $$app.setPostponedTask = function (du_minute, options) {
                        if ($$flag.postponed_task_deploying) {
                            return;
                        }
                        $$flag.postponed_task_deploying = true;

                        let _opt = options || {};
                        let _is_async = _opt.is_async === undefined || _opt.is_async === true;
                        let _is_toast = _opt.is_toast === undefined || _opt.is_toast === true;

                        let _task_s = this.task_name + '任务';
                        let _toast_lv = _is_toast ? 2 : 0;
                        let _msg = s => consolex.d(['推迟' + _task_s, s], _toast_lv, 0, 2);

                        let _ts = this.ts + du_minute * 60e3;
                        let _suff = storagesx.af.get('fg_blist_ctr') ? '_auto' : '';

                        if (Number(du_minute) === -1) {
                            //// -=-= PENDING =-=- ////
                            _msg('任务触发条件: 息屏时');
                            pluginsx.af.on_screen_off_launcher.deploy({
                                callback(task) {
                                    $$app.setStoAutoTask({
                                        task: task,
                                        next_ts: -1,
                                        next_type: 'on_screen_off',
                                    }, () => $$app.exit());
                                },
                            });
                        } else {
                            _msg('推迟时长: ' + du_minute + '分钟');
                            timersx.addDisposableTask({
                                path: $$app.cwp,
                                date: _ts,
                                is_async: _is_async,
                                callback(task) {
                                    $$app.setStoAutoTask({
                                        task: task,
                                        next_ts: _ts,
                                        next_type: 'postponed' + _suff,
                                    }, () => $$app.exit());
                                },
                            });
                        }
                    };
                    /**
                     * @param {Object} auto_task
                     * @param {org.autojs.autojs.timing.TimedTask} auto_task.task
                     * @param {number} auto_task.next_ts
                     * @param {NextAutoTaskType} auto_task.next_type
                     * @param {function(task:org.autojs.autojs.timing.TimedTask)} [callback]
                     * @return {org.autojs.autojs.timing.TimedTask}
                     */
                    $$app.setStoAutoTask = function (auto_task, callback) {
                        /**
                         * @typedef {
                         *     'uninterrupted'|'min_countdown'|'postponed'|'postponed_auto'|'on_screen_off'
                         * } NextAutoTaskType
                         * @typedef {{
                         *     task_id?: number,
                         *     timestamp?: number,
                         *     type?: NextAutoTaskType,
                         * }} NextAutoTaskInfo
                         */
                        let _info = {
                            task_id: auto_task.task.id,
                            timestamp: auto_task.next_ts,
                            type: auto_task.next_type,
                        };
                        this.removeStoAutoTaskIFN(_info);
                        storagesx.af_auto.put('next_auto_task', _info);

                        if (typeof callback === 'function') {
                            callback(auto_task.task);
                        }

                        return auto_task.task;
                    };
                    /**
                     * @param {NextAutoTaskInfo} [def]
                     * @return {NextAutoTaskInfo}
                     */
                    $$app.getStoAutoTask = function (def) {
                        return storagesx.af_auto.get('next_auto_task', def || {});
                    };
                    /**
                     * @param {NextAutoTaskInfo} task
                     * @return {boolean}
                     */
                    $$app.removeStoAutoTaskIFN = function (task) {
                        let _sto_task = this.getStoAutoTask();
                        let _sto_id = _sto_task.task_id;
                        if (_sto_id > 0 && _sto_id !== task.task_id) {
                            consolex._(['移除旧的自动定时任务', '任务ID: ' + _sto_id]);
                            if (_sto_task.timestamp < 0) {
                                timersx.removeIntentTask(_sto_id, {is_async: true});
                            } else {
                                timersx.removeTimedTask(_sto_id, {is_async: true});
                            }
                        }
                    };

                    return this;
                },
                setLayout() {
                    // noinspection HtmlUnknownTarget,HtmlRequiredAltAttribute
                    $$app.layout = {
                        fullscreen_cover: {
                            is_cover: true,
                            xml: <frame id="cover" bg="#DD000000"/>,
                            deploy() {
                                let _win = this.window = floaty.rawWindow(this.xml);
                                ui.post(() => {
                                    // prevent touch event being transferred to the view beneath
                                    _win.setTouchable(true);
                                    _win.setSize(-1, -1);
                                });
                            },
                            close() {
                                _closeWindow.call(this);
                            },
                            setOnTouchListener(onTouchFx) {
                                let _this = this;
                                this.window || this.deploy();
                                this.window['cover'].setOnTouchListener({
                                    onTouch(view, e) {
                                        return onTouchFx.call(_this, view, e);
                                    },
                                });
                            },
                            setOnClickListener(onClickFx) {
                                let _this = this;
                                this.window || this.deploy();
                                this.window['cover'].setOnClickListener({
                                    onClick(view, e) {
                                        return onClickFx.call(_this, view, e);
                                    },
                                });
                            },
                        },
                        next_auto_task: {
                            cfg: {
                                layout_width: cX(0.44),
                                position_y: cY(0.26),
                                colors: {
                                    img: '#CCFF90',
                                    text: '#DCEDC8',
                                },
                            },
                            xml: <vertical id="view">
                                <x-img id="img" src="@drawable/ic_alarm_on_black_48dp"
                                       bg="?selectableItemBackgroundBorderless"
                                       marginBottom="5" height="66" gravity="center"/>
                                <x-text id="text" size="17" marginBottom="8" gravity="center"
                                        fontFamily="sans-serif-condensed" line_spacing="5cx"/>
                            </vertical>,
                            close() {
                                _closeWindow.call(this);
                            },
                            deploy() {
                                _initCfgColors.call(this);
                                let _w = this.cfg.layout_width;
                                let _y = this.cfg.position_y;
                                let _win = this.window = floaty.rawWindow(this.xml);

                                ui.post(() => {
                                    _win.setSize(_w, -2);
                                    _win.setPosition(halfW - _w / 2, _y);
                                    _win['view'].on('click', this._onClick.bind(this));
                                    _win['img'].attr('tint_color', this.cfg.colors.img);
                                    _win['text'].attr('color', this.cfg.colors.text);
                                    this._countdown($$app.next_auto_task_ts);
                                });

                            },
                            _countdown(t) {
                                let _now = new Date();
                                let _now_ts = _now.getTime();
                                let _now_yy = _now.getFullYear();
                                let _now_MM = _now.getMonth();
                                let _now_dd = _now.getDate();
                                let _day_ms = 24 * 3.6e6;

                                let _aim_str = '';
                                let _ctd_str = '';

                                let _tsToTime = (ts, is_gap) => {
                                    if (is_gap) {
                                        ts += new Date(new Date().toLocaleDateString()).getTime();
                                    }
                                    let _d = new Date(ts);
                                    return _d.getHours().padStart(2, 0) + ':' +
                                        _d.getMinutes().padStart(2, 0) + ':' +
                                        _d.getSeconds().padStart(2, 0);
                                };

                                let _aim = (function $iiFe() {
                                    if (typeof t === 'number') {
                                        _aim_str = _tsToTime(t);
                                        return new Date(t);
                                    }
                                    if (t instanceof Date) {
                                        _aim_str = _tsToTime(t.getTime());
                                        return t;
                                    }
                                    if (typeof t !== 'string') {
                                        throw Error('Invalid type of time param');
                                    }
                                    if (!t.match(/^\d{2}:\d{2}:\d{2}$/)) {
                                        throw Error('Invalid format of time param');
                                    }
                                    _aim_str = t;
                                    // noinspection JSCheckFunctionSignatures
                                    let _args = [Date].concat([_now_yy, _now_MM, _now_dd], t.split(':'));
                                    return new (Array.bind.apply(Date, _args));
                                })();
                                let _aim_ts = _aim.getTime();
                                if (typeof t === 'string') {
                                    while (_aim_ts <= _now_ts) {
                                        _aim_ts += _day_ms;
                                    }
                                }

                                let _getAimStr = () => {
                                    let _now = new Date();
                                    let _today_0h_ts = new Date(_now.toLocaleDateString()).getTime();
                                    let _aim_sign = _aim_ts >= _today_0h_ts + _day_ms ? '+' : '=';
                                    return _aim_sign + '\x20' + _aim_str + '\x20' + _aim_sign;
                                };

                                let _getCtdStr = () => {
                                    let _ctd_sign = '-';
                                    let _gap_ts = _aim_ts - $$app.ts;
                                    _ctd_str = _tsToTime(Math.max(_gap_ts, 0), 'GAP');
                                    return _ctd_sign + '\x20' + _ctd_str + '\x20' + _ctd_sign;
                                };

                                let _setText = () => {
                                    try {
                                        this.window['text'].setText([
                                            'Next auto task', _getAimStr(), _getCtdStr(),
                                        ].join('\n'));
                                    } catch (e) {
                                        // eg: java.lang.NullPointerException
                                    }
                                };

                                _setText();
                                this.itv_id = setInterval(_setText, 1e3);
                            },
                            _onClick() {
                                consolex._('终止结果展示');
                                consolex._('检测到定时任务布局点击');

                                consolex._('发送Floaty结束等待信号');
                                $$flag.floaty_result_fin = true;

                                $$flag.cover_user_touched = true;
                                $$app.layout.closeAll();

                                if ($$app.next_auto_task_ts) {
                                    timersx.addDisposableTask({
                                        path: './tools/show-next-auto-task-countdown.js',
                                        is_async: true,
                                    });
                                }
                            },
                        },
                        eballs_pick_result: {
                            cfg: {
                                layout_width: cX(0.59),
                                position_y: cY(0.57),
                                colors: {
                                    own: '#AED581',
                                    fri: '#4CAF50',
                                    failed: '#EC407A',
                                    vain: '#A1887F',
                                    text: '#FFFFFF',
                                },
                            },
                            uni: {
                                xml: <vertical>
                                    <frame id="hint" h="{{cX(0.078)}}px">
                                        <x-text id="text" gravity="center" size="14"/>
                                    </frame>
                                    <frame id="stp_up" h="{{cX(0.0156)}}px"/>
                                    <frame id="sum" h="{{cX(0.111)}}px">
                                        <x-text id="text" gravity="center" size="24"/>
                                    </frame>
                                    <frame id="stp_dn" h="{{cX(0.0156)}}px"/>
                                    <frame id="ctd" h="{{cX(0.078)}}px">
                                        <x-text id="text" gravity="center" size="14"/>
                                    </frame>
                                </vertical>,
                                deploy(data) {
                                    let _win = this.window;
                                    let _stp = {up: _win['stp_up'], dn: _win['stp_dn']};
                                    let _e_own = data.own, _e_fri = data.fri;
                                    let _c = this.cfg.colors;
                                    let _w = this.cfg.layout_width;
                                    let _y = this.cfg.position_y;

                                    let _w_hint_t = _win['hint']['text'];
                                    let _w_sum_t = _win['sum']['text'];
                                    let _w_ctd_t = _win['ctd']['text'];

                                    ui.post(() => {
                                        _win.setSize(_w, -2);
                                        _win.setPosition(halfW - _w / 2, _y);

                                        if (!_e_own && !_e_fri) {
                                            this._setBg([_stp.up, _stp.dn], _c.vain);
                                            _w_hint_t.setText(this._getHints());
                                            _w_sum_t.setText('0');
                                        } else if (_e_own > 0) {
                                            this._setBg([_stp.up, _stp.dn], _c.own);
                                            _w_hint_t.setText('Yourself');
                                            _w_sum_t.setText(_e_own.toString());
                                        } else if (_e_fri > 0) {
                                            this._setBg([_stp.up, _stp.dn], _c.fri);
                                            _w_hint_t.setText('Friends');
                                            _w_sum_t.setText(_e_fri.toString());
                                        } else {
                                            this._setBg([_stp.up, _stp.dn], _c.failed);
                                            _w_hint_t.setText('Failed');
                                            _w_sum_t.setText('Statistics failed');
                                        }

                                        uix.setTextColor([_w_hint_t, _w_sum_t, _w_ctd_t], _c.text);
                                    });
                                },
                            },
                            du: {
                                xml: <vertical>
                                    <horizontal id="hint" h="{{cX(0.078)}}px">
                                        <x-text id="own" gravity="center" size="14" layout_weight="1"/>
                                        <x-text id="fri" gravity="center" size="14" layout_weight="1"/>
                                    </horizontal>
                                    <horizontal id="stp_up" h="{{cX(0.0156)}}px">
                                        <frame id="own" layout_weight="1" h="*"/>
                                        <frame id="fri" layout_weight="1" h="*"/>
                                    </horizontal>
                                    <frame id="sum" h="{{cX(0.111)}}px">
                                        <x-text id="text" gravity="center" size="24"/>
                                    </frame>
                                    <horizontal id="stp_dn" h="{{cX(0.0156)}}px">
                                        <frame id="own" layout_weight="1" h="*"/>
                                        <frame id="fri" layout_weight="1" h="*"/>
                                    </horizontal>
                                    <frame id="ctd" h="{{cX(0.078)}}px">
                                        <x-text id="text" gravity="center" size="14"/>
                                    </frame>
                                </vertical>,
                                deploy(data) {
                                    let _win = this.window;
                                    let _stp = {up: _win['stp_up'], dn: _win['stp_dn']};
                                    let _e_own = data.own, _e_fri = data.fri;
                                    let _c = this.cfg.colors;
                                    let _w = this.cfg.layout_width;
                                    let _y = this.cfg.position_y;

                                    let _w_hint_o = _win['hint']['own'];
                                    let _w_hint_f = _win['hint']['fri'];
                                    let _w_sum_t = _win['sum']['text'];
                                    let _w_ctd_t = _win['ctd']['text'];

                                    ui.post(() => {
                                        _win.setSize(_w, -2);
                                        _win.setPosition(halfW - _w / 2, _y);

                                        _w_hint_o.setText('Yourself: ' + _e_own);
                                        _w_hint_f.setText('Friends: ' + _e_fri);
                                        _w_sum_t.setText((_e_own + _e_fri).toString());

                                        this._setBg([_stp.up['own'], _stp.dn['own']], _c.own);
                                        this._setBg([_stp.up['fri'], _stp.dn['fri']], _c.fri);
                                        uix.setTextColor([_w_hint_o, _w_hint_f, _w_sum_t, _w_ctd_t], _c.text);
                                    });
                                },
                            },
                            /**
                             * @param {{countdown:number,own:number,fri:number}} data
                             */
                            deploy(data) {
                                threadsx.start(() => this._deploy(data));
                            },
                            close() {
                                _closeWindow.call(this);
                            },
                            _deploy(data) {
                                _initCfgColors.call(this);
                                let _this = data.own > 0 && data.fri > 0 ? this.du : this.uni;
                                this.window = floaty.rawWindow(_this.xml);
                                _this.deploy.call(this, data);
                                this._countdown(data.countdown);
                            },
                            _setBg(views, color) {
                                views.forEach(v => v.setBackgroundColor(color));
                            },
                            _getHints() {
                                let _notes = [
                                    // Never say die (永不言弃)
                                    'NEVER.contains(SAY_DIE)',
                                    // Life isn't all roses (生活并非事事如意)
                                    'LIFE !== ALL ROSES',
                                    // Nothing is impossible (一切皆有可能)
                                    'IMPOSSIBLE === undefined',
                                    // Believe that god is fair (相信上帝公平)
                                    'GOD.isFair() === true',
                                    // Don't give up and don't give in (不言弃 不言败)
                                    '/((?!GIVE+(UP|IN)).)+/i',
                                    // Zero in your target, and go for it (从零开始 勇往直前)
                                    'for (i=0; i<Infinity; i++)',
                                    // Infinite luck (好运无限)
                                    'LUCK.length === Infinity',
                                    // Be more lucky next time (再接再厉)
                                    'LLIST.next === LUCKY',
                                    // A blessing in disguise (塞翁失马 焉知非福)
                                    'for (BLESSING in DISGUISE)',
                                    // Stay hydrated (多喝水)
                                    'WATER.drink().drink()',
                                    // Enjoy your life (享受生活)
                                    'LIFE.includes(ENJOYABLE)',
                                ];

                                consolex._('随机挑选提示语');
                                return _notes[Math.rand(_notes.length, -0)];
                            },
                            _countdown(n) {
                                let _n = parseInt(n);
                                let _w = this.window['ctd']['text'];
                                let _err_ctr = 0;
                                let _fin = (fx) => {
                                    fx && fx.call(null);
                                    consolex._('发送Floaty结束等待信号');
                                    $$flag.floaty_result_fin = true;
                                    clearInterval(_itv_id);
                                };
                                let _setText = function () {
                                    _err_ctr < 3 || _fin(() => {
                                        consolex.$('此设备无法正常使用Floaty功能', 3, 1);
                                        consolex.$('建议改用Toast方式显示收取结果', 3);
                                    });
                                    try {
                                        _w.setText('- ' + _n + ' -');
                                        _n-- || _fin(() => {
                                            consolex._('Floaty倒计时结束');
                                            consolex._('统计结果展示完毕');
                                        });
                                    } catch (e) {
                                        _err_ctr += 1;
                                    }
                                };
                                _setText();
                                let _itv_id = this.itv_id = setInterval(_setText, 1e3);
                            },
                        },
                        update_avail: {
                            cfg: {
                                layout_width: W,
                                position_y: cY(0.78),
                                colors: {
                                    img: '#69F0AE',
                                    text: '#E8F5E9',
                                },
                            },
                            xml: <vertical id="view">
                                <horizontal gravity="center" height="45">
                                    <x-img id="img" src="@drawable/ic_fiber_new_black_48dp"
                                           height="29" paddingRight="5" adjustViewBounds="true"
                                           bg="?selectableItemBackgroundBorderless"/>
                                    <x-text id="text_title" size="16" gravity="center"
                                            fontFamily="sans-serif-condensed"/>
                                </horizontal>
                                <x-text id="text_ver" gravity="center" paddingBottom="11"
                                        fontFamily="sans-serif-condensed" size="16"/>
                            </vertical>,
                            deploy() {
                                let _this = this;
                                let _ver = '';
                                let _getVer = () => _ver = $$app.newest_release_ver_name;
                                threadsx.start(function () {
                                    if (a11yx.wait(_getVer, 0, 120)) {
                                        if (appx.version.isNewer(_ver, $$app.project_ver_name)) {
                                            _this._deploy();
                                        }
                                    }
                                });
                            },
                            close() {
                                _closeWindow.call(this);
                            },
                            _deploy() {
                                let _ver_local = $$app.project_ver_name;
                                let _ver_newest = $$app.newest_release_ver_name;
                                if (appx.version.isNewer(_ver_newest, _ver_local)) {
                                    _initCfgColors.call(this);
                                    let _w = this.cfg.layout_width;
                                    let _y = this.cfg.position_y;
                                    let _c = this.cfg.colors;
                                    let _win = this.window = floaty.rawWindow(this.xml);
                                    ui.post(() => {
                                        _win.setSize(_w, -2);
                                        _win.setPosition(halfW - _w / 2, _y);
                                        _win['view'].on('click', this._onClick.bind(this));
                                        _win['text_title'].attr('text', 'Update available');
                                        _win['text_title'].attr('color', _c.text);
                                        _win['text_ver'].attr('text', _ver_local + '  ->  ' + _ver_newest);
                                        _win['text_ver'].attr('color', _c.text);
                                        _win['img'].attr('tint_color', _c.img);
                                    });
                                }
                            },
                            _onClick() {
                                consolex._('终止结果展示');
                                consolex._('检测到更新提示布局点击');

                                consolex._('发送Floaty结束等待信号');
                                $$flag.floaty_result_fin = true;

                                $$flag.cover_user_touched = true;
                                $$flag.update_dialog_uphold = true;
                                $$app.layout.closeAll();

                                let _newest = $$app.newest_release;
                                let _newest_ver = _newest.version_name;

                                dialogsx.builds(['项目更新',
                                    '本地版本: ' + $$app.project_ver_name + '\n' +
                                    '最新版本: ' + _newest_ver,
                                    ['忽略此版本', 'warn'], 'X',
                                    ['查看更新', 'attraction'], 1,
                                ], {
                                    keycode_back: 'disabled',
                                }).on('neutral', (d) => {
                                    d.dismiss();
                                    timersx.rec.save('update_dialog_uphold');
                                    dialogsx.builds([
                                        '版本忽略提示', 'update_ignore_confirm',
                                        0, 'Q', ['确定忽略', 'caution'], 1,
                                    ], {
                                        keycode_back: 'disabled',
                                    }).on('negative', (ds) => {
                                        d.show();
                                        ds.dismiss();
                                        timersx.rec.save('update_dialog_uphold');
                                    }).on('positive', (ds) => {
                                        ds.dismiss();
                                        let _k = 'update_ignore_list';
                                        let _new = {};
                                        _new[_k] = $$cfg[_k].concat([_newest_ver]);
                                        storagesx.af_cfg.put('config', _new);
                                        $$toast('已忽略当前版本', 'long');
                                        delete $$flag.update_dialog_uphold;
                                    }).show();
                                }).on('negative', (d) => {
                                    d.dismiss();
                                    delete $$flag.update_dialog_uphold;
                                }).on('positive', (d) => {
                                    d.dismiss();
                                    timersx.rec.save('update_dialog_uphold');
                                    dialogsx.builds([
                                        '版本详情', _newest.brief_info_str,
                                        ['浏览器查看', 'hint'], 'B',
                                        ['立即更新', 'attraction'], 1,
                                    ], {
                                        keycode_back: 'disabled',
                                    }).on('neutral', (ds) => {
                                        ds.dismiss();
                                        app.openUrl(_newest.html_url);
                                        timersx.rec.save('update_dialog_uphold');
                                    }).on('negative', (ds) => {
                                        d.show();
                                        ds.dismiss();
                                        timersx.rec.save('update_dialog_uphold');
                                    }).on('positive', (ds) => {
                                        let _clearFlags = () => {
                                            delete $$flag.update_dialog_deploying;
                                            delete $$flag.update_dialog_uphold;
                                        };
                                        project.deploy(_newest, {
                                            onDeployStart() {
                                                ds.dismiss();
                                                $$flag.update_dialog_deploying = true;
                                            },
                                            onDeploySuccess: () => _clearFlags(),
                                            onDeployFailure: () => _clearFlags(),
                                        });
                                    }).show();
                                }).show();
                            },
                        },
                        screen_turning_off: {
                            xml: <vertical id="view">
                                <x-img id="img" src="@drawable/ic_hourglass_empty_black_48dp"
                                       bg="?selectableItemBackgroundBorderless"
                                       height="55" gravity="center" margin="0 12 0 15"/>
                                <x-text id="title" gravity="center" line_spacing="8cx"
                                        size="19" fontFamily="sans-serif-condensed"/>
                                <x-text id="hint_duration" gravity="center" line_spacing="7cx"
                                        size="16" fontFamily="sans-serif-condensed" marginTop="80"/>
                                <x-text id="hint_interrupt" gravity="center" line_spacing="7cx"
                                        size="16" fontFamily="sans-serif-condensed" marginTop="30"/>
                            </vertical>,
                            cfg: {
                                layout_width: W,
                                position_y: cY(0.25),
                                colors: {
                                    img: '#E1BEE7',
                                    text: '#F3E5F5',
                                },
                            },
                            deploy() {
                                threadsx.start(() => this._deploy());
                            },
                            close() {
                                _closeWindow.call(this);
                            },
                            _deploy() {
                                _initCfgColors.call(this);
                                let _w = this.cfg.layout_width;
                                let _y = this.cfg.position_y;
                                let _c = this.cfg.colors;
                                let _win = this.window = floaty.rawWindow(this.xml);

                                ui.post(() => {
                                    _win.setTouchable(false);
                                    _win.setSize(_w, -1);
                                    _win.setPosition(halfW - _w / 2, _y);
                                });

                                let _w_img = _win['img'];
                                let _w_title = _win['title'];
                                let _w_duration = _win['hint_duration'];
                                let _w_interrupt = _win['hint_interrupt'];

                                this.itv_id = setInterval(() => {
                                    android.animation.ObjectAnimator
                                        .ofFloat(_w_img, 'rotation', [0, 180])
                                        .setDuration(1.6e3)
                                        .start();
                                }, 2.4e3);

                                let _msg = {
                                    title: {
                                        eng: 'Please wait while turning off screen\n' +
                                            'is in progress...',
                                        chs: '正在尝试关闭屏幕...',
                                    },
                                    duration: {
                                        eng: 'This may take a few seconds',
                                        chs: '此过程可能需要几秒钟',
                                    },
                                    interrupt: {
                                        eng: 'Touch anywhere or press any key to interrupt',
                                        chs: '触摸屏幕或按下任意按键可终止关屏',
                                    },
                                    $bind() {
                                        Object.keys(this).forEach((k) => {
                                            this[k].toString = () => {
                                                return this[k].eng + '\n' + this[k].chs;
                                            };
                                        });
                                        delete this.$bind;
                                        return this;
                                    },
                                }.$bind();

                                _w_title.attr('text', _msg.title);
                                _w_title.attr('color', _c.text);
                                _w_duration.attr('text', _msg.duration);
                                _w_duration.attr('color', _c.text);
                                _w_interrupt.attr('text', _msg.interrupt);
                                _w_interrupt.attr('color', _c.text);
                                _w_img.attr('tint_color', _c.img);
                            },
                        },
                    };

                    Object.defineProperty($$app.layout, 'closeAll', {
                        value(without_cover) {
                            let _layouts = Object.values($$app.layout).filter((o) => {
                                if (without_cover && o.is_cover) {
                                    return false;
                                }
                                return o.itv_id || o.window;
                            });
                            if (_layouts.length) {
                                consolex._('关闭所有自定义悬浮窗');
                                _layouts.forEach(o => o.close.call(o));
                            }
                        },
                        enumerable: false, // default
                    });

                    return this;

                    // tool function(s) //

                    function _closeWindow() {
                        this.itv_id && clearInterval(this.itv_id);
                        this.window && this.window.close();
                    }

                    function _initCfgColors() {
                        let _alpha = this.cfg['color_alpha'] || 0xFF;
                        Object.keys(this.cfg.colors).forEach((k) => {
                            let _c = this.cfg.colors[k];
                            this.cfg.colors[k] = colors.argb(_alpha,
                                colors.red(_c),
                                colors.green(_c),
                                colors.blue(_c));
                        });
                    }
                },
            };
        }
    },
    queue() {
        let _my_e = enginesx.my_engine;
        let _my_e_id = enginesx.my_engine_id;
        let _excl_tag = 'exclusive_task';
        let _ts_tag = 'launch_timestamp';
        _my_e.setTag(_excl_tag, 'af');
        _my_e.setTag(_ts_tag, $$app.ts);

        let _b = bombSetter();
        _b.trigger() && _b.explode();

        let _q = $$app.queue = queueSetter();
        _q.trigger() && _q.monitor() && _q.queue();

        return $$init;

        // tool function(s) //

        function bombSetter() {
            return {
                trigger() {
                    let _max = 20;
                    while (_max--) {
                        try {
                            return engines.all().filter((e) => {
                                let _gap = () => $$app.ts - e.getTag(_ts_tag);
                                return e.getTag(_excl_tag) === 'af'
                                    && _my_e_id > e.id
                                    && _gap() < $$cfg.min_bomb_interval_global;
                            }).length;
                        } catch (e) {
                            // Wrapped java.util.ConcurrentModificationException
                            // exception happens with a tiny possibility
                            $$sleep(30, 80);
                        }
                    }
                },
                explode() {
                    consolex.$('脚本因安全限制被强制终止', 3, 0, 0, -1);
                    consolex.$('连续运行间隔时长过小', 3, 0, 1);
                    consolex.$('触发脚本炸弹预防阈值', 3, 0, 1, 1);
                    exit();
                },
            };
        }

        function queueSetter() {
            return {
                get excl_tasks_all() {
                    while (1) {
                        try {
                            return engines.all().filter(e => e.getTag(_excl_tag));
                        } catch (e) {
                            // Wrapped java.util.ConcurrentModificationException
                            // exception happens with a small possibility
                            $$sleep(20, 50);
                        }
                    }
                },
                get excl_tasks_ahead() {
                    while (1) {
                        try {
                            return engines.all().filter((e) => (
                                e.getTag(_excl_tag) && e.id < _my_e_id
                            ));
                        } catch (e) {
                            // Wrapped java.util.ConcurrentModificationException
                            // exception happens with a small possibility
                            $$sleep(20, 50);
                        }
                    }
                },
                get excl_tasks_ahead_len() {
                    return this.excl_tasks_ahead.length;
                },
                get excl_tasks_all_len() {
                    return this.excl_tasks_all.length;
                },
                trigger() {
                    return this.excl_tasks_ahead_len;
                },
                monitor() {
                    consolex._('设置广播监听器');

                    events.broadcast.on('init_scr_on_state_change', (v) => {
                        consolex._('接收到初始屏幕开关状态广播');
                        if (!$$app.queue.excl_tasks_ahead_len) {
                            consolex._('根据广播消息修改状态参数');
                            $$app.init_scr_on_from_broadcast = v;
                        } else {
                            consolex._('放弃广播消息');
                            consolex._('当前任务正在排队中');
                        }
                    });

                    return this;
                },
                queue() {
                    timersx.rec.save('sc_q'); // script queue
                    timersx.rec.save('sc_q_total');

                    let _init_que_len = this.excl_tasks_ahead_len;
                    let _que_len = _init_que_len;
                    let _sto_max_que_t = $$cfg.max_queue_time_global;
                    consolex._('排他性任务排队中: ' + _que_len + '项');

                    let _init_max_que_t = _sto_max_que_t * _que_len;
                    let _max_que_t = _init_max_que_t;
                    consolex._('已设置最大排队时间: ' + _max_que_t + '分钟');

                    while ((_que_len = this.excl_tasks_ahead_len)) {
                        if (_que_len !== _init_que_len) {
                            consolex._('排他性任务队列发生变更', 0, 0, -1);
                            let _amt = _init_que_len + '->' + _que_len;
                            consolex._('任务数量: ' + _amt + '项');
                            _init_que_len = _que_len;
                            _max_que_t = _sto_max_que_t * _que_len;
                            let _t = _init_max_que_t + '->' + _max_que_t;
                            consolex._('最大排队: ' + _t + '分钟');
                            _init_max_que_t = _max_que_t;
                            timersx.rec.save('sc_q'); // refresh
                        }
                        if (timersx.rec.gt('sc_q', _max_que_t * 60e3)) {
                            this.excl_tasks_ahead.forEach(e => e.forceStop());
                            consolex._('强制停止队前所有排他性任务');
                            consolex._('已达最大排队等待时间');
                        }
                        $$sleep(1e3, '±500');
                    }

                    consolex.debug.__('solid', 1);
                    consolex._('任务排队用时: ' + $$cvt.time(timersx.rec('sc_q_total'), '$zh'));
                },
            };
        }
    },
    unlock() {
        let _is_scr_on = devicex.is_init_screen_on;
        let _is_unlked = devicex.isUnlocked();
        let _err = m => consolex.$(['脚本无法继续', m], 8, 4, 0, 2);

        if (!$$cfg.auto_unlock_switch) {
            _is_scr_on || _err('屏幕关闭且自动解锁功能未开启');
            _is_unlked || _err('设备上锁且自动解锁功能未开启');
        }

        _is_unlked && _is_scr_on ? consolex._('无需解锁') : devicex.unlock();
        $$flag.dev_unlocked = true;

        return $$init;
    },
    prompt() {
        let _pre_run = preRunSetter();
        _pre_run.trigger() && _pre_run.prompt();

        return $$init;

        // tool function(s) //

        function preRunSetter() {
            return {
                trigger() {
                    if (!$$cfg.prompt_before_running_switch) {
                        consolex._('"运行前提示"未开启');
                        return false;
                    }
                    if (!$$cfg.message_showing_switch) {
                        consolex._('"消息提示"未开启');
                        return false;
                    }
                    if ($$app.engines_exec_argv.is_instant_running) {
                        consolex._('跳过"运行前提示"');
                        consolex._('检测到"立即运行"引擎参数');
                        return false;
                    }
                    if ($$cfg.prompt_before_running_auto_skip) {
                        if (!devicex.is_init_screen_on) {
                            consolex._('跳过"运行前提示"');
                            consolex._('屏幕未亮起');
                            return false;
                        }
                        if (!devicex.is_init_unlocked) {
                            consolex._('跳过"运行前提示"');
                            consolex._('设备未锁定');
                            return false;
                        }
                    }
                    return true;
                },
                prompt() {
                    dialogsx.buildCountdown(['运行提示',
                        '\n即将在 %timeout% 秒内运行' + $$app.task_name + '任务\n',
                        ['推迟任务', 'warn'], ['放弃任务', 'caution'], ['立即开始', 'attraction'], 1,
                    ], {
                        timeout: $$cfg.prompt_before_running_countdown_seconds,
                        timeout_button: 'positive',
                        onNeutral(d) {
                            let _ = {
                                key: 'prompt_before_running_postponed_minutes',
                            };
                            let _cfg = {
                                /** @return {number[]} */
                                sto_min_map: [-1].concat($$cfg[_.key + '_choices']),
                                /** @return {number} */
                                get sto_min() {
                                    return Number($$cfg[_.key]);
                                },
                                /** @param {number} v */
                                set sto_min(v) {
                                    let _new = {};
                                    _new[_.key] = v;
                                    storagesx.af_cfg.put('config', _new);
                                    Object.assign($$cfg, _new);
                                },
                                /** @return {number} */
                                get user_min() {
                                    return Number($$cfg[_.key + '_user']);
                                },
                                /** @param {number} v */
                                set user_min(v) {
                                    let _new = {};
                                    _new[_.key + '_user'] = v;
                                    storagesx.af_cfg.put('config', _new);
                                    Object.assign($$cfg, _new);
                                },
                            };
                            if (!isNaN(_cfg.sto_min) && _cfg.sto_min !== 0) {
                                d.dismiss();
                                return $$app.monitor.insurance.clean({
                                    is_async: true,
                                    callback: () => $$app.setPostponedTask(_cfg.sto_min),
                                }).reset();
                            }
                            let _minutes = _cfg.sto_min_map; // [-1, 1, 2, 5, 10, ...]
                            dialogsx
                                .builds(['设置任务推迟时间', '',
                                    0, 'B', ['K', 'warn'],
                                    1, '记住设置且不再提示'], {
                                    items: _minutes.map(x => x > 0 ? x + '\x20min' : {
                                        '-1': '息屏时',
                                    }[x]),
                                    itemsSelectMode: 'single',
                                    itemsSelectedIndex: _minutes.indexOf(_cfg.user_min),
                                })
                                .on('negative', (ds) => {
                                    ds.dismiss();
                                })
                                .on('positive', (ds) => {
                                    dialogsx.dismiss(ds, d);
                                    _cfg.user_min = _minutes[ds.getSelectedIndex()];
                                    if (ds.isPromptCheckBoxChecked()) {
                                        _cfg.sto_min = _cfg.user_min;
                                    }
                                    if ($$app.monitor.insurance.trigger()) {
                                        $$app.monitor.insurance.clean({is_async: true}).reset();
                                    }
                                    $$app.setPostponedTask(_cfg.user_min);
                                })
                                .show();
                        },
                        onNegative(d) {
                            let _quitNow = () => {
                                d.dismiss();
                                $$app.tidy(0);
                                // language=JS
                                //consolex.$('`放弃${$$app.task_name}任务`'.ts, 1, 1, 0, 2);
                                exit();
                            };

                            if (!$$cfg.prompt_before_running_quit_confirm) {
                                return _quitNow();
                            }
                            dialogsx.builds((function $iiFe() {
                                // language=JS
                                let _z = '`当前未设置任何${$$app.task_name}定时任务\n\n`'.ts;
                                let _q = '确认要放弃本次任务吗';
                                let [_title, _cnt] = timersx.queryTimedTasks({path: $$app.cwp})
                                    .filter(task => task.id !== $$app.monitor.insurance.id).length
                                    ? [['提示', 'default'], [_q, 'default']]
                                    : [['注意', 'caution'], [_z + _q, 'warn']];
                                return [_title, _cnt, 0, 'B', ['确认放弃任务', 'caution'], 1, 1];
                            })()).on('negative', (ds) => {
                                dialogsx.dismiss(ds);
                            }).on('positive', (ds) => {
                                dialogsx.dismiss(ds);
                                storagesx.af_cfg.put('config', {
                                    prompt_before_running_quit_confirm: !ds.isPromptCheckBoxChecked(),
                                });
                                _quitNow();
                            }).show();
                        },
                        onPositive(d) {
                            d.dismiss();
                        },
                        onPause: {
                            content: [/.*(".+".*任务).*/, '选择$1运行选项'],
                        },
                        onTimeout() {
                            consolex._(['运行提示计时器超时', '任务自动继续']);
                            return 'positive';
                        },
                    }).act().block({
                        timeout: 2, // minutes
                        onTimeout() {
                            $$app.tidy(1);
                            consolex.$([
                                '强制结束' + $$app.task_name + '任务',
                                '等待运行提示对话框操作超时',
                            ], 8, 4, 0, 2);
                        },
                    });
                },
            };
        }
    },
    command() {
        let _ = cmdSetter();
        _.trigger() && _.exec();

        return $$init;

        // tool function(s) //

        function cmdSetter() {
            let _cmd = $$app.engines_exec_argv.cmd;
            /**
             * @typedef {
             *     'launch_rank_list'|'get_rank_list_names'|'get_current_acc_name'
             * } AntForestLauncherCommand
             */
            let _commands = {
                launch_rank_list() {
                    $$app.page.rl.launch({is_show_greeting: false});
                    _quit('app');
                },
                get_rank_list_names() {
                    _launch() && _collect();
                    _quit();

                    // tool function(s) //

                    function _launch() {
                        timersx.rec.save('get_rl_data');
                        return $$app.page.rl.launch({is_show_greeting: false});
                    }

                    function _collect() {
                        $$app.task_name = '好友列表数据采集'.surround('"');
                        consolex.$('正在采集好友列表数据', 1, 1, 0, 2);

                        $$af.rl.scroll.toBottom({itv: 0});

                        let _ls_data = _getListData();
                        storagesx.af.remove('friends_list_data'); // discarded data
                        storagesx.af_flist.put('friends_list_data', _ls_data);

                        let _et = $$cvt.time(timersx.rec('get_rl_data'), '$zh');
                        let _sum = _ls_data.list_length + ' 项';
                        consolex.$('采集完毕', 1, 1, 0, -1);
                        consolex.$('用时 ' + _et, 1, 0, 1);
                        consolex.$('总计 ' + _sum, 1, 0, 1, 1);

                        // tool function(s) //

                        function _getListData() {
                            let _fri = $$af._collector.fri;
                            let _data = [];
                            $$sel.get('energy_amt', 'wc').slice(1).forEach((w, i) => {
                                let _nick = $$sel.pickup([w, _fri.getRlNickCompass(w)], 'txt');
                                let _rank = i < 3 ? i + 1 : $$sel.pickup([w, _fri.getRlRankNum(w)], 'txt');
                                _data.push({rank_num: _rank.toString(), nickname: _nick});
                            });

                            let _max_len = _data[_data.length - 1].rank_num.length;
                            let _pad = new Array(_max_len).join('0');
                            _data.map(o => o.rank_num = (_pad + o.rank_num).slice(-_max_len));

                            return {
                                timestamp: $$app.ts,
                                list_data: _data,
                                list_length: _data.length,
                            };
                        }
                    }
                },
                get_current_acc_name() {
                    timersx.rec.save('cur_acc_nm');

                    let _name = _byPipeline() || '';
                    consolex.$('采集完毕');

                    let _sto_key = 'collected_current_account_name';
                    storagesx.af.remove(_sto_key);
                    storagesx.af.put(_sto_key, _name);

                    let _et = $$cvt.time(timersx.rec('cur_acc_nm'), '$zh');
                    consolex.$('用时 ' + _et, 1, 0, 1);

                    _quit();

                    // tool function(s) //

                    function _byPipeline() {
                        let _name = '';
                        let _thd_get_name = threadsx.start(_thdGetName);
                        let _thd_mon_logout = threadsx.start(_thdMonLogout);

                        a11yx.wait(() => _name || $$flag.acc_logged_out, 12e3);

                        _thd_get_name.interrupt();
                        _thd_mon_logout.interrupt();

                        if (_name) {
                            return _name;
                        }

                        if ($$flag.acc_logged_out) {
                            consolex.$('账户已登出', 3, 1, 0, -2);
                            delete $$flag.acc_logged_out;
                        }

                        // thread function(s) //

                        function _thdGetName() {
                            $$app.task_name = '采集当前账户名'.surround('"');
                            $$app.page.alipay.home();

                            consolex.$('正在采集当前账户名', 1, 0, 0, -1);

                            a11yx.pipeline('支付宝个人主页', [
                                ['我的', 'k1'],
                                idMatches(/.*userinfo_view/),
                                ['个人主页', 'k4'],
                                '支付宝账户',
                            ]);

                            let _txt = '';
                            let _sel = () => $$sel.pickup(['支付宝账户', 's>1'], 'txt');
                            a11yx.wait(() => _txt = _sel(), 2e3);

                            return _name = _txt ? $$acc.encode(_txt) : '';
                        }

                        function _thdMonLogout() {
                            delete $$flag.acc_logged_out;
                            while (!$$acc.isInLoginPg() && !$$sel.get('acc_logged_out')) {
                                sleep(500);
                            }
                            $$flag.acc_logged_out = true;
                        }
                    }
                },
            };

            return {
                trigger() {
                    if (_cmd) {
                        if (_cmd in _commands) {
                            return true;
                        }
                        consolex.$('脚本无法继续', 4, 0, 0, -1);
                        consolex.$('未知的传递指令参数:', 4, 1, 1);
                        consolex.$(_cmd, 8, 0, 1, 1);
                    }
                },
                exec() {
                    consolex._(['执行传递指令:', _cmd]);
                    _commands[_cmd]();
                    sleep(4e3);
                },
            };

            // tool function(s) //

            /** @param {...('alipay'|'app')} [aim] */
            function _quit(aim) {
                let _aim = Array.from(arguments, s => s.toLowerCase());
                _aim = _aim.length ? _aim : ['alipay', 'app'];
                _aim.includes('alipay') && $$app.page.alipay.close();
                _aim.includes('app') && ui.post(exit);
            }
        }
    },
};

let $$farm = {
    _epilogue_setter: {
        readyExit() {
            return Promise.resolve()
                .then(_cleanerReady).catch(this.err)
                .then(_floatyReady).catch(this.err)
                .then(_autoTaskReady).catch(this.err);

            // tool function(s) //

            function _cleanerReady() {
                $$app.tidy(0);
            }

            function _floatyReady() {
                return $$flag.show_floaty_result && new Promise((reso) => {
                    consolex._('监测Floaty结束等待信号');
                    timersx.rec.save('floaty_result_waiting');
                    timersx.setInterval(function () {
                        let _ctd = $$cfg.floaty_result_countdown_sec;
                        let _max = (_ctd + 5) * 1e3;
                        if (timersx.rec.gt('floaty_result_waiting', _max)) {
                            $$flag.floaty_result_fin = true;
                            consolex._('放弃等待Floaty消息结束信号', 3);
                            consolex._('等待结束信号超时', 3);
                        }
                    }, 200, function () {
                        if ($$flag.floaty_result_fin) {
                            consolex._('检测到Floaty结束等待信号');
                            $$app.layout.closeAll('without_cover');
                            reso(_updateDialogAsync());
                            return true;
                        }
                    });
                });

                // tool function(s) //

                function _updateDialogAsync() {
                    return $$flag.update_dialog_uphold && new Promise((resolve) => {
                        consolex._('等待更新对话框结束信号');
                        timersx.rec.save('update_dialog_uphold');
                        let _fin = (msg) => {
                            consolex._(msg);
                            clearInterval(_itv);
                            resolve(true);
                        };
                        let _tt = () => ($$flag.update_dialog_deploying ? 5 : 1) * 60e3;
                        let _itv = setInterval(() => {
                            if (!$$flag.update_dialog_uphold) {
                                _fin('检测到更新对话框结束信号');
                            }
                            if (timersx.rec.gt('update_dialog_uphold', _tt())) {
                                _fin('放弃等待更新对话框结束信号');
                            }
                        }, 200);
                    });
                }
            }

            function _autoTaskReady() {
                return new Promise((reso) => {
                    let _thd = $$app.thd_set_auto_task;
                    let _cond = function () {
                        if (!_thd || !_thd.isAlive()) {
                            return reso() || true;
                        }
                    };
                    if (!_cond()) {
                        consolex._('等待定时任务设置完成');
                        timersx.setInterval(function () {
                            let _max = 10e3;
                            if (timersx.rec.gt('set_auto_task', _max)) {
                                consolex.$('放弃等待定时任务设置完成', 4);
                                consolex.$('等待超时', 4, 0, 1);
                                _thd.interrupt();
                                reso();
                            }
                        }, 200, _cond);
                    }
                });
            }
        },
        scrOffIFN() {
            if ($$bool($$app.init_scr_on_from_broadcast)) {
                $$app.init_scr_on = $$app.init_scr_on_from_broadcast;
            }

            if ($$app.queue.excl_tasks_all_len > 1) {
                consolex._('跳过关闭屏幕');
                consolex._('当前存在排他性排队任务');
                return false;
            }

            if ($$app.init_scr_on) {
                consolex._('无需关闭屏幕');
                return false;
            }

            if ($$flag.cover_user_touched) {
                consolex._('跳过关闭屏幕');
                consolex._('检测到屏幕触碰');
                return false;
            }

            if ($$flag.epilogue_err_occurred) {
                consolex._('跳过关闭屏幕');
                consolex._('检测到收场过程错误标记');
                return false;
            }

            $$flag.glob_e_scr_paused = true;

            devicex.screenOff({
                key_code: {
                    is_disabled: !($$app.has_root && $$app.root_fxs.screen_off),
                },
                provider: {
                    hint() {
                        if ($$flag.floaty_result_all_set) {
                            $$app.layout.screen_turning_off.deploy();
                        }
                    },
                    listener(brake) {
                        events.observeKey();
                        events.on('key_down', function (kc) {
                            $$flag.floaty_result_all_set && $$app.layout.closeAll();
                            brake('终止屏幕关闭', '检测到按键行为', '键值: ' + kc);
                        });

                        if ($$flag.floaty_result_all_set) {
                            $$app.layout.fullscreen_cover.setOnClickListener(function () {
                                if ($$flag.cover_user_touched) {
                                    brake('终止屏幕关闭', '检测到屏幕触碰');
                                    $$app.layout.closeAll();
                                }
                            });
                        }
                    },
                },
            });
        },
        exitNow: () => $$app.exit(),
        err(e) {
            if (!e.message.match(/InterruptedException/)) {
                consolex.$(e.message, 4, 1, 0, -1);
                consolex.$(e.stack, 4, 0, 0, 1);
            }
            $$flag.epilogue_err_occurred = true;
        },
    },
    epilogue() {
        let _ = this._epilogue_setter;
        Promise.all([_.readyExit()])
            .then(_.scrOffIFN)
            .then(_.exitNow)
            .catch(_.err);
    }
}

// entrance //
$$init.check().global().queue().unlock().prompt().command();

require("./modules/plugin-farm").run();

$$farm.epilogue();