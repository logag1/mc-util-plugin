import {
  ServerEvents,
  PlayerJoinEvent,
  PlayerQuitEvent,
  PlayerChatEvent
} from '@customrealms/core';

export interface EventHandlerType {
  _setJoinMessage(event: PlayerJoinEvent): void;
  _setQuitMessage(event: PlayerQuitEvent): void;
  _setChatEvent(event: PlayerChatEvent): void;

  registerAll(): Promise<void>;
}

export class EventHandler implements EventHandlerType {

  _setJoinMessage(event: PlayerJoinEvent): void {
    const joinPlayer = event.getPlayer().getName();
    event.setJoinMessage(`[+] ${joinPlayer}`);
  }

  _setQuitMessage(event: PlayerQuitEvent): void {
    const quitPlayer = event.getPlayer().getName();
    console.log(event);
    event.setQuitMessage(`[-] ${quitPlayer}`);
  }

  _setChatEvent(event: PlayerChatEvent): void {
    const player = event.getPlayer();
    const message = event.getMessage();
    event.setMessage(`| [USER]: ${message}`);
  }

  async registerAll(): Promise<void> {
    ServerEvents.register(PlayerJoinEvent, this._setJoinMessage);
    ServerEvents.register(PlayerQuitEvent, this._setQuitMessage);
    ServerEvents.register(PlayerChatEvent, this._setChatEvent);
  }
}