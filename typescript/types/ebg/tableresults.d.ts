import "ebg/thumb";
import "ebg/core/core";
declare global {
    namespace BGA {
        interface AjaxActions {
            "/table/table/tableratingsupdate.html": {
                _successargs: [TableResultsData];
                id: BGA.ID;
            };
            "/table/table/loadStickyNote.html": {
                _successargs: [
                    {
                        player: BGA.ID;
                        note: string;
                    }
                ];
                player: BGA.ID;
            };
            "/table/table/updateText.html": {
                type: "stickynote";
                id: BGA.ID;
                text: string;
            };
        }
        interface TableResultsData {
            status: 'finished' | 'archive' | string;
            progression: number;
            result: {
                endgame_reason: 'normal_end' | 'normal_concede_end' | 'neutralized_after_skipturn' | 'neutralized_after_skipturn_error' | string;
                trophies?: Record<BGA.ID, Record<BGA.ID, TableResultTrophies>>;
            };
            tableinfos: {
                id: BGA.ID;
                result: {
                    ratings_update: {
                        players_current_ratings: Record<BGA.ID, {
                            elo: BGA.ID;
                        }>;
                        players_elo_rating_update: Record<BGA.ID, {
                            duels: any;
                            real_elo_delta: number;
                            global_modifiers: boolean;
                            elo_delta_adjust_desc: string;
                            new_elo_rating: number;
                        }>;
                    };
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
                };
                game_name: string;
                game_status: string;
            };
            game_hide_ranking: boolean;
        }
        interface TableResultTrophies {
            id: BGA.ID;
        }
    }
}
declare class TableResults_Template {
    page: InstanceType<BGA.CorePage> | null;
    div: HTMLElement | null;
    jstpl_template: string;
    jstpl_score_entry: string;
    jstpl_trophy: string;
    jstpl_statistics: string;
    jstpl_table_stat: string;
    jstpl_playerstatheader: string;
    jstpl_playerstat: string;
    tableinfos: BGA.TableResultsData | null;
    pma: boolean;
    stats_div?: HTMLElement;
    playeropinion?: any;
    create(t: InstanceType<BGA.CorePage>, i: HTMLElement | string, n: HTMLElement | string, o: BGA.TableResultsData, a: boolean): void;
    destroy(): void;
    update(): void;
    onEditSticky(t: Event): void;
    updateStats(): void;
    insertTableStat(statename: string, value: string, unit?: string): void;
    onPublishResult(t: Event): void;
    addPlayerEloTooltipNew(e: string): void;
}
declare let TableResults: DojoJS.DojoClass<TableResults_Template, []>;
export = TableResults;
declare global {
    namespace BGA {
        type TableResults = typeof TableResults;
        interface EBG {
            tableresults: TableResults;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=tableresults.d.ts.map