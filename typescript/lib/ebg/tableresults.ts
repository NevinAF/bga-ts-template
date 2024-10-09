// @ts-nocheck

import e = require("dojo");
import declare = require("dojo/_base/declare");
import "ebg/thumb";
import "ebg/core/core";

declare global {
	namespace BGA {
		interface AjaxActions {
			"/table/table/tableratingsupdate.html": {
				_successargs: [TableResultsData],
				id: BGA.ID;
			};
			"/table/table/loadStickyNote.html": {
				_successargs: [{
					player: BGA.ID;
					note: string;
				}],
				player: BGA.ID;
			};
			"/table/table/updateText.html": {
				type: "stickynote", id: BGA.ID, text: string
			};
		}

		interface TableResultsData {
			status: 'finished' | 'archive' | string;
			progression: number;
			result: {
				endgame_reason: 'normal_end' | 'normal_concede_end' | 'neutralized_after_skipturn' | 'neutralized_after_skipturn_error' | string;
				trophies?: Record<BGA.ID,
					Record<BGA.ID, TableResultTrophies>
				>;
			}
			tableinfos: {
				id: BGA.ID;
				result: {
					ratings_update: {
						players_current_ratings: Record<BGA.ID, { elo: BGA.ID }>;
						players_elo_rating_update: Record<BGA.ID, {
							duels: any;
							real_elo_delta: number;
							global_modifiers: boolean;
							elo_delta_adjust_desc: string;
							real_elo_delta: number;
							new_elo_rating: number;
						}>;
					}
					stats: {
						table: Record<BGA.ID, {
							id: BGA.ID;
							valuelabel: string;
							value: string;
							type: "int" | "float" | "boolean";
							unit: string;
						}>;
						player: Record<BGA.ID, {
							id: BGA.ID;
							valuelabel: string;
							value: string;
							type: "int" | "float" | "boolean";
							unit: string;
						}>;
					};
					time_duration: number;
					is_solo: boolean;
					table_level: number;
					player: Record<BGA.ID, {
						player_id: BGA.ID;
						name: string;
						gamerank: number;
						score: number;
					}>;
				}
				game_name: string;
				game_status: string;
			}
			game_hide_ranking: boolean;
		}

		interface TableResultTrophies {
			id: BGA.ID;
		}
	}
}

class TableResults_Template
{
	page: InstanceType<BGA.CorePage> | null = null;
	div: HTMLElement | null = null;
	jstpl_template: string = '<div class="game_abandonned" id="game_abandonned" style="display:none">                                        <h4 class="game_result_status_important">${LB_GAME_ABANDONNED}</h4>                                        <span id="game_abandonned_explanation"></span>                                        <br/>                                        <br/>                                    </div>                                    <div class="game_cancelled" id="game_cancelled" style="display:none">                                        <h4 class="game_result_status_important">${LB_GAME_RESULT_CANCELLED} (${LB_SOMEONE_LEFT_THE_GAME_BEFORE_THE_END}) :</h4>                                        ${THE_PLAYER_WHO_LEFT}<br/>                                        ${THE_OTHERS_PLAYERS}                                        <br/>                                        <br/>                                    </div>                                    <div class="game_cancelled" id="game_unranked_cancelled" style="display:none">                                        <h4 class="game_result_status_important">${LB_SOMEONE_LEFT_THE_GAME_BEFORE_THE_END}</h4>                                        <br/>                                    </div>                                    <h4 class="game_conceded" id="game_conceded" style="display:none">${LB_GAME_CONCEDED}</h4>                                    <h4 class="game_unranked" id="game_unranked" style="display:none"><span id="game_unranked_label">${label_unranked} <i class="fa fa-question-circle"></i></span></h4>                                    <div class="game_result" id="game_result"></div>                                    <div id="tiebreaker_explanation"></div>                                    <div class="publishresult_container">                                        <span class="publishresult_button">                                            <span class="publishresult bgabutton bgabutton_gray" id="publishresult">                                                <i class="fa fa-share-alt"></i> ${share}                                            </span>                                            <div id="publishresult_content">                                                <div class="fb-share-button" data-href="https://${LANGUAGE_SHORT}.boardgamearena.com/table?table=${TABLE_ID}" data-layout="button" data-size="large"></div>                                            </div>                                        </span>                                    </div>';
	jstpl_score_entry: string = 
		'<div class="score-entry" id="score_entry_${player_id}"><div class="rank">${rankstr}</div><div class="emblemwrap ${emblem_class} emblemwrap_l"><img id="emblem_${player_id}" src="${emblem}" alt="${name}" class="emblem"/><div class="emblempremium"></div></div><div class="name"><a href="${url_base}/player?id=${player_id}" id="player_${player_id}_name" class="playername">${name}</a><span style="display:${is_bug_reporter_display}"> (' +
		__("lang_mainsite", "Bug reporter") +
		')</span><span style="display:${is_creator_display}"> [creator]</span></div><div class="score">${score} <i class="fa fa-lg fa-star"></i><span class="score_aux score_aux_${score} tttiebraker" id="score_aux_${index}"> (${score_aux}<i class="fa fa-star tiebreaker"></i>)</span></div><div class="clear"></div><div class="adddetails adddetails_arena"><span class="rankdetails rankdetailsarena" style="display:${show_arena}"><div id="winpointsarena_${player_id}" class="winpoints"><span class="" id="winpointsarena_value_${player_id}">${arena_win_display}</span> &nbsp;&nbsp;<img alt="->" src="' +
		getStaticAssetUrl("img/common/arrow.png") +
		'" class="imgtext"/>&nbsp;&nbsp;</div><div id="newrankarena_${player_id}" class="newrank">${arena_after_display}</div></span></div><div id="adddetails_${player_id}" class="adddetails"><span class="rankdetails"><div id="winpoints_${player_id}" class="winpoints"><span id="leave_${player_id}" style="display:none;" class="leavepenalty">&nbsp;<span id="leavevalue_wrap_${player_id}"><div class="icon20 icon20_penaltyleave "></div> </span></span><span class="" id="winpoints_value_${player_id}">${point_win}</span> &nbsp;&nbsp;<img alt="->" src="' +
		getStaticAssetUrl("img/common/arrow.png") +
		'" class="imgtext"/>&nbsp;&nbsp;</div><div id="newrank_${player_id}" class="newrank">${rank_after_game}</div></span><div class="penalties"><span id="clock_${player_id}" style="display:none;" class="clockpenalty">&nbsp;<div class="icon20 icon20_penaltyclock"></div></span></div></div><br/><div class="reputation_wrap" style="display:${reputation_display}"><p id="reputation_block_${player_id}"><div class="reputation" id="reput_${player_id}"></div></p><br/><p id="stickynote_wrap_${player_id}" class="stickynote_wrap"><a class="bga-link" href="#" id="stickynote_edit_${player_id}"><i class="fa fa-lg fa-sticky-note-o"></i>&nbsp; <span id="stickynote_ctrl_${player_id}"></span></a></p></div><div class="clear"></div></div>';
	jstpl_trophy = '<div class="trophy">                           <a id="award_${AWARD_ID}" href="${url_base}/award?game=${GAME_ID}&award=${AWARD_TYPE_ID}">                                <div class="trophyimg_wrap"><div class="trophyimg" id="awardimg_${AWARD_ID}" style="background-image:  url(\'${base_img}\')"></div></div>                                <div class="trophyname"><b>${TROPHY_NAME}</b><br/>${TROPHY_SPECIAL} <div class="xp_container">+${TROPHY_PRESTIGE} XP<div class="arrowback"></div><div class="arrow"></div><div class="arrowbackl"></div><div class="arrowl"></div></div></div><div class="clear"></div>                            </a>                        </div>';
	jstpl_statistics = '<p>${intro}</p><div id="table_stats" class="smalltext">                </div>                <div id="player_stats">                    <table class="statstable" id="player_stats_table">                        <tr id="player_stats_header">                            <th></th>                        </tr>                    </table>                </div>';
	jstpl_table_stat = '<div class="row-data">                            <div class="row-label" title="${statname}">${statname}</div>                            <div class="row-value">&nbsp;${value} ${unit}</div>                        </div>';
	jstpl_playerstatheader = '<th id="playerstatheader_${ID}">${NAME}</th>';
	jstpl_playerstat = "<tr>                                <th>${NAME}</th>                                ${PLAYER_STATS}                            </tr>";
	tableinfos: BGA.TableResultsData | null = null;
	pma = false;

	stats_div?: HTMLElement;
	playeropinion?: any;

	create(t: InstanceType<BGA.CorePage>, i: HTMLElement | string, n: HTMLElement | string, o: BGA.TableResultsData, a: boolean) {
		this.page = t;
		this.div = i;
		this.stats_div = n;
		this.tableinfos = o;
		this.pma = a;
		if ($(this.div)) {
			e.place(
				e.string.substitute(this.jstpl_template, {
					LANGUAGE_SHORT: e.config.locale.substr(0, 2),
					TABLE_ID: o.id,
					LB_GAME_ABANDONNED: __("lang_mainsite", "LB_GAME_ABANDONNED"),
					LB_GAME_CONCEDED: __("lang_mainsite", "LB_GAME_CONCEDED"),
					label_unranked: __("lang_mainsite", "Unranked game (Training mode)"),
					LB_SOMEONE_LEFT_THE_GAME_BEFORE_THE_END: __("lang_mainsite", "LB_SOMEONE_LEFT_THE_GAME_BEFORE_THE_END"),
					LB_GAME_RESULT_CANCELLED: __("lang_mainsite", "LB_GAME_RESULT_CANCELLED"),
					THE_PLAYER_WHO_LEFT: __("lang_mainsite", "The player who left (or was skipped) lost the game and got a %s penalty.").replace("%s", "☯"),
					THE_OTHERS_PLAYERS: __("lang_mainsite", "The other players won this game and get %s of normal ELO points (because %s of this game has been played before the incident).").replace("%s", this.tableinfos.progression + "%").replace("%s", this.tableinfos.progression + "%"),
					share: __("lang_mainsite", "Share"),
				}),
				this.div,
				"replace"
			);
			this.playeropinion = {};
			e.connect(
				$("publishresult"),
				"onclick",
				this,
				"onPublishResult"
			);
			this.page.ajaxcall(
				"/table/table/tableratingsupdate.html",
				{ id: this.tableinfos.id },
				this,
				function (e) {
					this.tableinfos.result.ratings_update = e;
					this.update();
				}
			);
			this.updateStats();
		}
	}

	destroy() {}

	update() {
		var t = this.tableinfos;
		undefined !== t.thumbs && (this.playeropinion = t.thumbs);
		if (undefined === i) var i = this.page.player_id;
		e.style("game_abandonned", "display", "block");
		e.style("publishresult", "display", "none");
		var n,
			o = true;
		if (
			"didntstart_cron_timeout" ===
			t.result.endgame_reason
		)
			$("game_abandonned_explanation").innerHTML = __(
				"lang_mainsite",
				"Table closed automatically because not enough players joined the table after a while."
			);
		else if (
			"didntstart_cron_init_timeout" ===
			t.result.endgame_reason
		)
			$("game_abandonned_explanation").innerHTML = __(
				"lang_mainsite",
				"Table has been abandonned during initial configuration."
			);
		else if (
			"didntstart_players_left" ===
			t.result.endgame_reason
		)
			$("game_abandonned_explanation").innerHTML = __(
				"lang_mainsite",
				"All players left the game before it begins."
			);
		else if (
			"didntplay_cron_timeout" === t.result.endgame_reason
		)
			$("game_abandonned_explanation").innerHTML = __(
				"lang_mainsite",
				"Game has been closed automatically because no move had been done on it during a long period of time."
			);
		else if (
			"normal_end" === t.result.endgame_reason ||
			"normal_concede_end" === t.result.endgame_reason
		) {
			e.style("game_abandonned", "display", "none");
			e.style("publishresult", "display", "none");
			o = true;
			"normal_concede_end" === t.result.endgame_reason &&
				e.style("game_conceded", "display", "block");
		} else if (
			"neutralized_after_skipturn" ===
				t.result.endgame_reason ||
			"neutralized_after_skipturn_error" ===
				t.result.endgame_reason
		) {
			e.style($("game_cancelled"), "display", "block");
			e.style("game_abandonned", "display", "none");
			e.style("publishresult", "display", "none");
			o = true;
		} else
			"abandon_by_decision" === t.result.endgame_reason
				? ($("game_abandonned_explanation").innerHTML =
						__(
							"lang_mainsite",
							"The game has been abandonned because all players (with a positive clock) decided it, or because all players left the game."
						))
				: "abandon_by_tournamenttimeout" ===
				  t.result.endgame_reason
				? ($("game_abandonned_explanation").innerHTML =
						__(
							"lang_mainsite",
							"Game has been abandonned automatically because players did not managed to finish it before the next round of the tournament. The player with the most remaining reflexion time wins the game."
						))
				: "error_tournament_wrongnumber" ===
				  t.result.endgame_reason
				? ($("game_abandonned_explanation").innerHTML =
						__(
							"lang_mainsite",
							"Some players of this tournament game did not show up, so we could not start the game (these players got a penalty on their profile)."
						))
				: "synchro_error_corrupted" ===
						t.result.endgame_reason ||
				  "synchro_error_finished_on_gs" ===
						t.result.endgame_reason ||
				  "synchro_error_not_on_gs" ===
						t.result.endgame_reason
				? ($("game_abandonned_explanation").innerHTML =
						__(
							"lang_mainsite",
							"Game has been closed automatically due to a technical error"
						) +
						" (" +
						t.result.endgame_reason +
						")")
				: "express_stop" === t.result.endgame_reason
				? ($("game_abandonned_explanation").innerHTML =
						"A developer cancel this game using Express Stop.")
				: "abandon_sandbox_disagreement" ==
				  t.result.endgame_reason
				? ($("game_abandonned_explanation").innerHTML =
						__(
							"lang_mainsite",
							"The players disagree on the game result of this game, so we cancelled it."
						))
				: ($("game_abandonned_explanation").innerHTML =
						"Unknow endgame reason: " +
						t.result.endgame_reason);
		if (1 == toint(t.unranked)) {
			if (
				"neutralized_after_skipturn" ===
					t.result.endgame_reason ||
				"neutralized_after_skipturn_error" ===
					t.result.endgame_reason
			) {
				e.style($("game_cancelled"), "display", "none");
				e.style(
					$("game_unranked_cancelled"),
					"display",
					"block"
				);
			}
			e.style($("game_unranked"), "display", "block");
			this.page.addTooltip(
				"game_unranked_label",
				__(
					"lang_mainsite",
					"The Training mode has been enabled for this table (no ranking points gain/loss for this game)."
				),
				""
			);
		}
		var a = null,
			s = [],
			r = null,
			l = {},
			d = true;
		for (var c in t.result.player) {
			r = (n = t.result.player[c]).player_id;
			n.is_creator_display =
				"undefined" != typeof globalUserInfos &&
				globalUserInfos.user_rights.includes(
					"display_technical"
				) &&
				t.table_creator === n.player_id
					? ""
					: "none";
			l[r] = {
				rank_after_game: n.rank_after_game,
				elo_win: n.point_win,
				rank_before_game:
					n.rank_after_game - n.point_win,
				gamerank: n.gamerank,
				name: n.name,
				opponents: {},
			};
			1 != n.gamerank && (d = true);
		}
		for (var r in l) {
			var h = 0;
			for (var u in l)
				if (u != r) {
					var p =
						l[r].rank_before_game -
						l[u].rank_before_game;
					if (
						toint(l[r].gamerank) <
						toint(l[u].gamerank)
					)
						var m = 1;
					else if (l[r].gamerank == l[u].gamerank)
						m = 0.5;
					else m = 0;
					var g = 1 / (1 + Math.pow(10, -p / 400)),
						f = m - g;
					h += f;
					l[r].opponents[u] = {
						gameresult: m,
						expectedResult: g,
						elo_delta_no_k: f,
					};
				}
			l[r].k_factor =
				0 != h ? Math.round(l[r].elo_win / h) : 60;
			if (
				1301 == l[r].rank_after_game &&
				1300 == l[r].rank_before_game
			) {
				l[r].k_factor = 60;
				l[r].particular_case = __(
					"lang_mainsite",
					"You always get at least 1 ELO point during your first game on BGA."
				);
			} else
				1400 == l[r].rank_after_game && h < 0
					? (l[r].particular_case = __(
							"lang_mainsite",
							"Note: you can never go back under 100 ELO."
					  ))
					: l[r].rank_after_game < 1400 &&
					  h < 0 &&
					  (l[r].particular_case = __(
							"lang_mainsite",
							"Note: you cannot lose ELO while your ELO has not reach 100."
					  ));
		}
		var _ = {};
		const v = new URLSearchParams(
			window.location.search
		).get("reporterId");
		if (v) {
			const e = document.getElementById("reviewgame");
			e && (e.href += "&reporterId=" + v);
		}
		for (var c in t.result.player) {
			r = (n = t.result.player[c]).player_id;
			n.index = c;
			n.rank_after_game, n.point_win;
			n.point_win_arena = "";
			n.show_arena = "none";
			n.arena_win_display = "";
			n.arena_after_display = "";
			if (n.score) {
				t.result.losers_not_ranked && !d
					? (n.rankstr = __("lang_mainsite", "Tie"))
					: t.result.is_coop || t.result.is_solo
					? n.score > 0
						? (n.rankstr = __(
								"lang_mainsite",
								"Winner"
						  ))
						: (n.rankstr = __(
								"lang_mainsite",
								"Loser"
						  ))
					: (n.rankstr = this.page.getRankString(
							n.gamerank,
							t.result.losers_not_ranked
					  ));
				n.point_win =
					Math.round(l[r].rank_after_game) -
					Math.round(l[r].rank_before_game);
				n.point_win >= 0 &&
					(n.point_win = "+" + n.point_win);
				n.rank_after_game = this.page.getEloLabel(
					n.rank_after_game
				);
				if (1 == toint(t.unranked)) {
					n.rank_after_game = "";
					n.point_win = "";
				}
				if (null != n.arena_points_win) {
					n.show_arena = "block";
					var b = this.page.arenaPointsDetails(
						n.arena_after_game
					);
					if (5 == b.league) {
						var y =
							n.arena_points_win >= 0 ? "+" : "";
						n.arena_win_display =
							y +
							Math.round(
								(n.arena_points_win % 1) * 1e4
							);
						n.arena_after_display =
							Math.round(
								(n.arena_after_game % 1) * 1e4
							) +
							" " +
							__("lang_mainsite", "pts") +
							" ";
						n.arena_after_display +=
							'<div style="display:inline-block;position:relative;margin-top: -32px;margin-bottom: 26px;">';
						n.arena_after_display +=
							'<div class="myarena_league league_' +
							b.league +
							'" style="position:relative;display:inline-block;top:21px;left:0px">';
						n.arena_after_display +=
							'<div class="arena_label"></div>';
						n.arena_after_display += "</div>";
						n.arena_after_display += "</div>";
					} else {
						if (n.arena_points_win > 100)
							n.arena_win_display = "";
						else {
							y =
								n.arena_points_win >= 0
									? "+"
									: "";
							n.arena_win_display =
								y +
								(Math.round(
									n.arena_points_win
								) %
									10) +
								'<div class="icon20 icon_arena"></div>';
						}
						n.arena_after_display =
							'<div style="display:inline-block;position:relative;margin-top: -29px;margin-bottom: 26px;">';
						n.arena_after_display +=
							'<div class="myarena_league league_' +
							b.league +
							'" style="position:relative;display:inline-block;top:21px;">';
						n.arena_after_display +=
							'<div class="arena_label">' +
							b.points +
							"</div>";
						n.arena_after_display += "</div>";
						n.arena_after_display += "</div>";
					}
				}
			} else {
				n.rank_mask = "";
				n.point_win = "";
				n.rank_after_game = "";
				n.is_tie = "";
				n.score = "";
				n.score_aux = "";
				n.rankstr = "";
			}
			n.emblem = getPlayerAvatar(
				n.player_id,
				n.avatar,
				50
			);
			null === n.gender && (n.gender = "");
			n.flag = n.country.code;
			n.table_id = t.id;
			n.emblem_class = "";
			1 == n.is_premium &&
				(n.emblem_class = "is_premium");
			null !== a &&
				a == n.score &&
				null !== n.score_aux &&
				s.push(n.score);
			_[c] = { score: n.score, score_aux: n.score_aux };
			a = n.score;
			null === n.score_aux && (n.score_aux = "");
			n.signal_player_label = __(
				"lang_mainsite",
				"Signal this player"
			);
			n.reputation_display = "block";
			r == i && (n.reputation_display = "none");
			n.url_base = "";
			undefined !== this.page.metasiteurl &&
				(n.url_base = this.page.metasiteurl);
			n.is_bug_reporter_display = v == r ? "" : "none";
			e.place(
				this.page.format_string(
					this.jstpl_score_entry,
					n
				),
				"game_result"
			);
			this.page.addTooltip(
				"flag_" + r,
				n.country.name,
				""
			);
			if (
				this.playeropinion[r] &&
				1 == this.playeropinion[r].n
			) {
				this.page.ajaxcall(
					"/table/table/loadStickyNote.html",
					{ player: r },
					this,
					function (e) {
						$(
							"stickynote_ctrl_" + e.player
						).innerHTML = e.note;
					}
				);
				this.page.addTooltip(
					"stickynote_edit_" + r,
					e.string.substitute(
						__(
							"lang_mainsite",
							"A personal note on ${player}, for your eyes only"
						),
						{ player: n.name }
					),
					__("lang_mainsite", "Modify")
				);
			} else {
				$("stickynote_ctrl_" + r).innerHTML =
					e.string.substitute(
						__(
							"lang_mainsite",
							"Write a personal note about ${name}"
						),
						{
							name: $("player_" + r + "_name")
								.innerHTML,
						}
					);
				this.page.addTooltip(
					"stickynote_edit_" + r,
					"",
					e.string.substitute(
						__(
							"lang_mainsite",
							"Write a personal note about ${player}, for your eyes only"
						),
						{ player: n.name }
					)
				);
			}
			e.connect(
				$("stickynote_edit_" + r),
				"onclick",
				this,
				"onEditSticky"
			);
			if (toint(t.result.penalties[r].clock) >= 0) {
				e.style("clock_" + r, "display", "inline");
				if (
					undefined !==
					t.result.penalties[r].clock_cancelled
				) {
					e.place(
						"<span> (" +
							__(
								"lang_mainsite",
								"Penalty cancelled"
							) +
							") </span>",
						"clock_" + r
					);
					e.addClass(
						"clock_" + r,
						"clockpenalty_cancelled"
					);
				}
			}
			if (toint(t.result.penalties[r].leave) >= 0) {
				if (
					undefined !==
					t.result.penalties[r].leave_cancelled
				) {
					e.place(
						"<span> (" +
							__(
								"lang_mainsite",
								"Penalty cancelled"
							) +
							") </span>",
						"leave_" + r
					);
					e.addClass(
						"leave_" + r,
						"leavepenalty_cancelled"
					);
				} else
					$("winpoints_value_" + r).innerHTML +=
						" - " + t.result.penalties[r].leave;
				e.style("leave_" + r, "display", "inline");
				e.style(
					"leavevalue_wrap_" + r,
					"display",
					"inline"
				);
			}
			Object.keys(this.tableinfos.result.ratings_update)
				.length > 0 && this.addPlayerEloTooltipNew(r);
			this.page.addTooltipToClass(
				"adddetails_arena",
				__(
					"lang_mainsite",
					"Arena points won/loss during this game"
				),
				""
			);
			var w = 0;
			this.playeropinion[r]
				? 0 == (w = toint(this.playeropinion[r].t)) &&
				  r != i &&
				  "none" !=
						e.style(
							"reputation_block_" + r,
							"display"
						) &&
				  true
				: r != i &&
				  "none" !=
						e.style(
							"reputation_block_" + r,
							"display"
						) &&
				  true;
			if (r == i) true;
			else {
				new ebg.thumb().create(
					this.page,
					"reput_" + r,
					r,
					w
				);
			}
		}
		null !== r &&
			e.addClass("score_entry_" + r, "last-score-entry");
		var C = null;
		null !== $("gametiebreaker")
			? (C = $("gametiebreaker").innerHTML)
			: undefined !== this.page.tiebreaker &&
			  (C = __(
					"lang_" + this.tableinfos.game_name,
					this.page.tiebreaker
			  ));
		if ("" != C && 1 != toint(t.cancelled)) {
			for (var c in s) {
				var k = s[c];
				e.query(".score_aux_" + k).style(
					"display",
					"inline"
				);
			}
			this.page.addTooltipToClass(
				"tttiebraker",
				__("lang_mainsite", "Tie breaker") + ": " + C,
				""
			);
			if (s.length > 0) {
				$("tiebreaker_explanation").innerHTML =
					"<div class='smalltext'>(<i class='fa fa-star tiebreaker'></i>: " +
					__("lang_mainsite", "Tie breaker") +
					": " +
					C +
					")</div><br/>";
				var x = true;
				$("gametiebreaker_split") &&
				"" != $("gametiebreaker_split").innerHTML
					? (x = $(
							"gametiebreaker_split"
					  ).innerHTML.split(","))
					: undefined !== this.page.tiebreaker_split &&
					  this.page.tiebreaker_split &&
					  (x = this.page.tiebreaker_split);
				if (x) {
					var T = {};
					for (var c in _) {
						var A = _[c].score,
							j = _[c].score_aux,
							S = [];
						S.push(parseInt(A));
						for (var E in x) {
							var N = Math.floor(j / x[E]);
							j -= N * x[E];
							S.push(N);
						}
						T[c] = {
							html: "",
							tie_step: 0,
							score: S,
						};
					}
					for (var c in T)
						for (var M in T)
							if (M != c)
								for (var E in T[c].score) {
									if (
										T[c].score[E] !=
										T[M].score[E]
									)
										break;
									T[c].tie_step++;
								}
					for (var c in T) {
						var D = "";
						if (T[c].tie_step > 0) {
							D = " (";
							for (E = 1; E <= T[c].tie_step; E++)
								undefined !== T[c].score[E] &&
									(D +=
										T[c].score[E] +
										'<i class="fa fa-star tiebreaker"></i> &nbsp;');
							D = D.slice(0, -7);
							D += ")";
							$("score_aux_" + c).innerHTML = D;
						}
					}
				}
			}
		}
		if (!o) {
			e.query(".rankdetails").style("display", "none");
			e.query(".score").style("display", "none");
		}
		(1 == t.unranked ||
			t.game_hide_ranking ||
			t.result.is_solo) &&
			e.query(".rankdetails").style("display", "none");
		this.page.addTooltipToClass(
			"clockpenalty",
			__(
				"lang_mainsite",
				"This player ran out of time during this game."
			),
			""
		);
		this.page.addTooltipToClass(
			"leavepenalty",
			__(
				"lang_mainsite",
				"This player left this game before the end."
			),
			""
		);
		this.page.addTooltipToClass(
			"leavepenalty_cancelled",
			__(
				"lang_mainsite",
				"This penalty has been cancelled because we judged that it was not this player fault (ex: technical error)."
			),
			""
		);
		this.page.addTooltipToClass(
			"clockpenalty_cancelled",
			__(
				"lang_mainsite",
				"This penalty has been cancelled because we judged that it was not this player fault (ex: technical error)."
			),
			""
		);
		"undefined" != typeof mainsite
			? mainsite.updatePremiumEmblemLinks()
			: null != typeof gameui &&
			  gameui.updatePremiumEmblemLinks();
	}

	onEditSticky(t: Event) {
		e.stopEvent(t);
		var i = t.currentTarget.id.substr(16);
		e.destroy("stickEditDialog");
		var n = new ebg.popindialog();
		n.create("stickEditDialog");
		n.setTitle(
			e.string.substitute(
				__(
					"lang_mainsite",
					"Write a personal note about ${name}"
				),
				{ name: $("player_" + i + "_name").innerHTML }
			)
		);
		n.setMaxWidth(400);
		n.tableModule = this.page;
		var o = "";
		$("stickynote_ctrl_" + i).innerHTML !=
			e.string.substitute(
				__(
					"lang_mainsite",
					"Write a personal note about ${name}"
				),
				{ name: $("player_" + i + "_name").innerHTML }
			) && (o = $("stickynote_ctrl_" + i).innerHTML);
		var a = '<div id="stickEditDialog">';
		a +=
			"<textarea id='sticky_text' style='width: 100%'>" +
			o +
			"</textarea>";
		a +=
			"<p><a class='bgabutton bgabutton_gray' id='stickyedit_cancel' href='#'><span>" +
			__("lang_mainsite", "Cancel") +
			"</span></a> <a class='bgabutton bgabutton_blue' id='stickyedit_save' href='#'><span>" +
			__("lang_mainsite", "Save") +
			"</span></a></p>";
		a += "</div>";
		n.setContent(a);
		n.show();
		e.connect(
			$("stickyedit_cancel"),
			"onclick",
			e.hitch(n, function (t) {
				t.preventDefault();
				e.destroy("stickEditDialog");
				this.destroy();
			})
		);
		e.connect(
			$("stickyedit_save"),
			"onclick",
			e.hitch(n, function (e) {
				e.preventDefault();
				var t = $("sticky_text").value;
				this.destroy();
				this.tableModule.ajaxcall(
					"/table/table/updateText.html",
					{ type: "stickynote", id: i, text: t },
					this,
					function (e) {}
				);
				$("stickynote_ctrl_" + i).innerHTML = t;
			})
		);
	}

	updateStats() {
		var t = "";
		if (this.tableinfos.result.stats) {
			this.pma ||
				"private" == this.tableinfos.game_status ||
				(t =
					'<p style="text-align:center;"><a href="/premium?src=gamestats" class="bgabutton bgabutton_blue">' +
					__(
						"lang_mainsite",
						"Go Premium to see game statistics!"
					) +
					"</a></p><br/><br/>");
			e.place(
				e.string.substitute(this.jstpl_statistics, {
					intro: t,
				}),
				this.stats_div,
				"only"
			);
			var i = 1;
			if (
				this.pma ||
				"private" == this.tableinfos.game_status
			) {
				this.insertTableStat(
					__("lang_mainsite", "Game duration"),
					Math.round(
						this.tableinfos.result.time_duration /
							60
					),
					__("lang_mainsite", "mn")
				);
				i++;
				if (
					!this.tableinfos.game_hide_ranking &&
					!this.tableinfos.result.is_solo
				) {
					this.insertTableStat(
						__(
							"lang_mainsite",
							"Players average level"
						),
						this.page.getEloLabel(
							this.tableinfos.result.table_level
						)
					);
					i++;
				}
			} else {
				this.insertTableStat(
					__("lang_mainsite", "Game duration"),
					'<img class="statmasked" id="statmasked_' +
						i +
						'" src="' +
						getStaticAssetUrl(
							"img/common/rankmask.png"
						) +
						'" alt="masked" />'
				);
				i++;
				if (
					!this.tableinfos.game_hide_ranking &&
					!this.tableinfos.result.is_solo
				) {
					this.insertTableStat(
						__(
							"lang_mainsite",
							"Players average level"
						),
						'<img class="statmasked" id="statmasked_' +
							i +
							'" src="' +
							getStaticAssetUrl(
								"img/common/rankmask.png"
							) +
							'" alt="masked" />'
					);
					i++;
				}
			}
			for (var n in this.tableinfos.result.stats.table) {
				i++;
				if (
					3 ==
						(c =
							this.tableinfos.result.stats.table[
								n
							]).id ||
					1 == c.id
				);
				else if (
					undefined !== c.value &&
					null !== c.value
				) {
					if (
						"*masked*" == c.value ||
						(!this.pma &&
							"private" !=
								this.tableinfos.game_status)
					)
						c.value =
							'<img class="statmasked" id="statmasked_' +
							i +
							'" src="' +
							getStaticAssetUrl(
								"img/common/rankmask.png"
							) +
							'" alt="masked" />';
					else {
						"int" == c.type
							? (c.value = Math.round(c.value))
							: "bool" == c.type &&
							  (c.value =
									0 == c.value
										? __(
												"lang_mainsite",
												"no"
										  )
										: __(
												"lang_mainsite",
												"yes"
										  ));
						undefined !== c.valuelabel &&
							(c.value = __(
								"lang_" +
									this.tableinfos.game_name,
								c.valuelabel
							));
					}
					this.insertTableStat(
						__(
							"lang_" + this.tableinfos.game_name,
							c.name
						),
						c.value,
						c.unit
					);
				}
			}
			this.page.addTooltipToClass(
				"statmasked",
				__(
					"lang_mainsite",
					"You must be a Premium member to see statistics"
				),
				""
			);
			var o = {},
				a = {};
			for (var n in this.tableinfos.result.player) {
				var s = this.tableinfos.result.player[n];
				e.place(
					e.string.substitute(
						this.jstpl_playerstatheader,
						{ ID: s.player_id, NAME: s.name }
					),
					"player_stats_header"
				);
				o[s.player_id] = s.gamerank;
				a[s.player_id] = s.score;
			}
			var r = "";
			for (var n in this.tableinfos.result.player) {
				var l = (s = this.tableinfos.result.player[n])
					.player_id;
				r +=
					"<td>" +
					this.page.getRankString(o[l]) +
					" (" +
					a[l] +
					'<i class="fa fa-lg fa-star"></i>)</td>';
			}
			e.place(
				e.string.substitute(this.jstpl_playerstat, {
					NAME: __("lang_mainsite", "LB_GAME_RESULT"),
					PLAYER_STATS: r,
				}),
				"player_stats_table"
			);
			for (var d in this.tableinfos.result.stats.player)
				if (
					("time_bonus_nbr" != d &&
						"reflexion_time_sd" != d) ||
					null !== $("go_to_table")
				) {
					r = "";
					var c,
						h =
							undefined ===
							(c =
								this.tableinfos.result.stats
									.player[d]).unit
								? ""
								: " " + c.unit,
						u = true;
					for (var n in this.tableinfos.result
						.player) {
						l =
							this.tableinfos.result.player[n]
								.player_id;
						var p = "-";
						undefined !== c.values[l] &&
							null !== c.values[l] &&
							(p = c.values[l]);
						i++;
						null !== p && (u = true);
						if (
							"*masked*" == p ||
							(!this.pma &&
								"private" !=
									this.tableinfos.game_status)
						)
							p =
								'<img class="statmasked" id="statmasked_' +
								i +
								'" src="' +
								getStaticAssetUrl(
									"img/common/rankmask.png"
								) +
								'" alt="masked" />';
						else if ("-" != p) {
							"int" == c.type
								? (p = Math.round(p))
								: "bool" == c.type &&
								  (p =
										0 == p
											? __(
													"lang_mainsite",
													"no"
											  )
											: __(
													"lang_mainsite",
													"yes"
											  ));
							undefined !== c.valuelabels[l] &&
								(p = __(
									"lang_" +
										this.tableinfos
											.game_name,
									c.valuelabels[l]
								));
							if ("reflexion_time" == d) {
								p =
									this.page.formatReflexionTime(
										p
									).string;
								h = "";
							}
						}
						r += "<td>" + p + h + "</td>";
					}
					u &&
						e.place(
							e.string.substitute(
								this.jstpl_playerstat,
								{
									NAME: __(
										"lang_" +
											this.tableinfos
												.game_name,
										c.name
									),
									PLAYER_STATS: r,
								}
							),
							"player_stats_table"
						);
				} else;
			r = "";
			for (var n in this.tableinfos.result.player) {
				r +=
					'<td class="smalltext"><div class="icon20 icon20_stat"></div> <a class="bga-link" href="/playerstat?id=' +
					(l = (s = this.tableinfos.result.player[n])
						.player_id) +
					"&game=" +
					this.tableinfos.game_id +
					'">' +
					__(
						"lang_mainsite",
						"%s`s statistics at this game"
					).replace("%s", s.name) +
					"</a></td>";
			}
			e.place(
				e.string.substitute(this.jstpl_playerstat, {
					NAME:
						'<div class="icon20 icon20_stat"></div> ' +
						__("lang_mainsite", "All stats"),
					PLAYER_STATS: r,
				}),
				"player_stats_table"
			);
		}
	}

	insertTableStat(statename: string, value: string, unit?: string) {
		undefined === unit && (unit = "");
		e.place(
			e.string.substitute(this.jstpl_table_stat, {
				statname: statename,
				value: value,
				unit: unit,
			}),
			"table_stats"
		);
	}

	onPublishResult(t: Event) {
		e.stopEvent(t);
		e.style("publishresult", "display", "none");
		e.style("publishresult_content", "display", "block");
		FB.XFBML.parse();
	}

	addPlayerEloTooltipNew(e: string) {
		let t = this.tableinfos.result.ratings_update,
			i = t.players_current_ratings[e],
			n = t.players_elo_rating_update[e];
		const o = new Intl.NumberFormat("en-US", {
			signDisplay: "exceptZero",
		});
		let a = "";
		if (
			this.tableinfos.game_hide_ranking ||
			this.tableinfos.result.is_solo
		)
			a += `\n                    <div class="elo-tooltip-coop-notice">\n                        ${_(
				"Additional details on ELO calculation are unavailable for this game"
			)}\n                    </div>\n                `;
		else {
			const e = Object.keys(n.duels).length;
			for (const i in n.duels) {
				const s = n.duels[i];
				let r = t.players_current_ratings[i],
					l = "";
				for (const e of s.duel_modifiers) {
					let t = e.description,
						i = e.description_args;
					if (t) {
						t = _(t);
						t = t.replace(
							new RegExp(
								Object.keys(i).join("|"),
								"g"
							),
							(e) => {
								let t = i[e].text;
								i[e].properties &&
									i[e].properties.forEach(
										(e) => {
											if (
												"highlight" ===
												e
											)
												t = `<span class='modifier-highlight'>${t}</span>`;
										}
									);
								return t;
							}
						);
						l += `<div class="modifier-description modifier-${e.type}">\n                                    ${t}\n                                </div>`;
					}
				}
				let d = parseInt(2 * s.duel_result),
					c = [
						_("defeat").toUpperCase(),
						_("tie").toUpperCase(),
						_("win").toUpperCase(),
					][d],
					h = ["red", "gray", "green"][d],
					u = o.format(
						Number.parseFloat(
							s.elo_delta / e
						).toFixed(2)
					),
					p = "gray";
				u > 0 && (p = "green");
				u < 0 && (p = "red");
				a += `<div class="duel">\n                            <div class="duel-profile">\n                                <div class="duel-opponent">\n                                    <span class="opponent-elo">${this.page.getEloLabel(
					r.elo,
					true
				)}</span>\n                                    <span>\n                                        <span class="opponent-name">${
					t.players_results[i].name
				}</span>\n                                        <span class="player-rank-pos">(${this.page.getRankString(
					t.players_results[i].rank
				)})</span>\n                                    </span>\n                                </div>\n                                <div class="duel-conditions">\n                                    <div class="duel-win-probability">\n                                        ${_(
					"Win probability"
				)}: ${Math.round(
					100 * s.expected_result
				)}%\n                                    </div>\n                                    <div class="duel-modifiers">\n                                        ${l}\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="duel-outcome" style="color:${h}">\n                                ${c}\n                            </div>\n                            <div class="duel-reward" style="color:${p}">\n                                ${u}\n                            </div>\n                        </div>`;
			}
		}
		let s = '<div class="arrows-cont">';
		for (let h = 0; h < 15; h++)
			s += '<div class="arrows-square"></div>';
		s += "</div>";
		let r = "gray";
		n.real_elo_delta > 0 && (r = "green");
		n.real_elo_delta < 0 && (r = "red");
		let l = "";
		if (n.global_modifiers) {
			for (const e in n.global_modifiers);
			l.length > 0 &&
				(l = `<div class="global-modifiers">\n                            ${l}\n                        </div>`);
		}
		let d = "";
		n.elo_delta_adjust_desc &&
			(d = `<div class="adjustment-description">\n                    ${_(
				n.elo_delta_adjust_desc
			)}\n                </div>`);
		let c = `<div class="player-elo-tooltip">\n                    <div class="elo-tooltip-title">\n                        <span class="header">${_(
			"Details of {ELO} calculation"
		).replace(
			"{ELO}",
			"<b>ELO</b>"
		)}</span>\n                        <span><span class="player-name">${
			t.players_results[e].name
		}</span><span class="player-rank-pos">(${this.page.getRankString(
			t.players_results[e].rank
		)})</span></span>\n                    </div>\n                    <div class="calculation-result">\n                        ${s}\n                        <div class="result-content">\n                            <div class="elo-before">\n                                <span>${this.page.getEloLabel(
			i.elo,
			true,
			true
		)}</span>\n                                <span>${_(
			"Before this game"
		)}</span>\n                            </div>\n                            <div class="elo-delta">\n                                <span style="color:${r}">${o.format(
			n.real_elo_delta
		)}</span>\n                                <span><b>${_(
			"ELO variation"
		)}</b></span>\n                            </div>\n                            <div class="elo-after">\n                                <span>${this.page.getEloLabel(
			n.new_elo_rating,
			true,
			true
		)}</span>\n                                <span>${_(
			"After this game"
		)}</span>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="calculation-description">\n                        ${l}\n                        ${d}\n                    </div>\n                    <div class="duels-list">\n                        ${a}\n                    </div>\n                </div>`;
		this.page.addTooltipHtml("adddetails_" + e, c);
	}
}

let TableResults = declare("ebg.tableresults", TableResults_Template);
export = TableResults;

declare global {
	namespace BGA {
		type TableResults = typeof TableResults;
		interface EBG { tableresults: TableResults; }
	}
	var ebg: BGA.EBG;
}