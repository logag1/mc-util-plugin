import {
  ServerCommands,
  Players,
  Player,
  ChatColor,
  PlayerInventory,
  Entity
} from '@customrealms/core';
import { EventHandler } from './handlers';

let tpaList: { [key: string]: { requester: string, target: string } } = {};

const event_handler = new EventHandler();
event_handler.registerAll();

function tpTimeout(player: Player, targetPlayer: Player) {
  setTimeout(() => {
    const playerName = targetPlayer.getName();
    if (tpaList[playerName]) {
      delete tpaList[playerName];
      player.sendMessage('Teleporting canceled');
      targetPlayer.sendMessage('Teleporting canceled');
    }
  }, 20000);
}

ServerCommands.register('/prefix {text}', (player, call) => {
  const prefix = call.getPlaceholder('text');
  const playerName = player.getName();

  player.setPlayerListName(`[${prefix}] ${playerName}`);
  player.sendMessage(`Set your new prefix! ${prefix}`);
});

/* TODO tpaList에 요청자와 대상자 모두 포함 */
/* 스핀 룰렛 만들기 */

ServerCommands.register('/tpa {player}', (player, call) => {
  const target = call.getPlaceholder('player')!;
  console.log(JSON.stringify(tpaList));
  if (tpaList[target] && 'requester' in tpaList[target]) return player.sendMessage('[!] You already sent teleport request');
  tpaList[target] = { requester: player.getName(), target: target }
  player.sendMessage(`[+] Send tp request to ${target}`);
  let targetPlayer = Players.getPlayerByUsername(target);
  if (!targetPlayer) return console.log('Error: cannot find player (tpa)');
  targetPlayer.sendMessage(`[!] Teleport request from ${player.getName()}, "/tpaccept" to accept`);
  tpTimeout(player, targetPlayer);
});

// 티피 수락
ServerCommands.register('/tpaccept', (player, call) => {

  if (tpaList[player.getName()] && 'requester' in tpaList[player.getName()]) {
    console.log('Has requester in tpalist');

    const requester = tpaList[player.getName()].requester;

    let requestPlayer = Players.getPlayerByUsername(requester);
    if (!requestPlayer) return console.log('Error: cannot find player (tpaccept)');

    console.log(`${player.getName()} accept ${requester}'s request!'`);
    requestPlayer.sendMessage('[!] Player accept your tp request!');
    requestPlayer.sendMessage('[!] Teleporting after 5 seconds...');
    delete tpaList[player.getName()];

    setTimeout(() => {
      const location = player.getLocation();
      requestPlayer!.teleport(location);
      requestPlayer?.sendMessage('[!] Teleporting...')
    }, 5000);

  } else {
    player.sendMessage('Dont have request to accept');
  }
});

ServerCommands.register('/tpbed', (player, call) => {
  let location = player.getBedSpawnLocation();
  if (!location) return player.sendMessage(`Don't have bed spawn point`);
  player.teleport(location);
});