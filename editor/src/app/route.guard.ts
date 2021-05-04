import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { DEFAULT_EXTENSION, Game } from './models';
import { AuthFacade, GameFacade } from './state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthFacade, private location: Location) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const { access_token } = route.queryParams;
    if (access_token) {
      this.location.replaceState('/');
    }
    this._auth.onAppEnter(access_token);
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class RouteGuard implements CanActivate {
  constructor(private _router: Router, private _game: GameFacade) {}

  canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const segments = getSegmentsFromUrl(this._router, state.url);

    if (segments.length === 0) {
      return this.goHome();
    }

    const game = getGame(segments.shift());

    if (!game) {
      return this.goHome();
    }

    const subPath = segments.shift();
    if (subPath === 'classes') {
      const className = segments.shift() || 'all';

      this._game.onListEnter({
        game,
        className,
        extension: DEFAULT_EXTENSION,
      });
      return true;
    }

    if (subPath === 'enums') {
      const enumName = segments.shift() || 'all';
      this._game.onListEnter({
        game,
        enumName,
        extension: DEFAULT_EXTENSION,
      });
      return true;
    }

    // extensions
    const opcode = segments.shift();
    const extension = subPath || DEFAULT_EXTENSION;
    this._game.onListEnter({
      game,
      extension,
      opcode,
    });

    return true;
  }

  goHome() {
    return this._router.parseUrl('/');
  }

  goGame(game: string) {
    return this._router.parseUrl('/' + game);
  }
}

function getSegmentsFromUrl(router: Router, url: string): string[] {
  const tree = router.parseUrl(url);
  return (
    tree.root?.children?.primary?.segments.map((segment) => segment.path) ?? []
  );
}

function getGame(game: string): Game | undefined {
  if (game === 'gta3') {
    return Game.GTA3;
  }
  if (game === 'vc') {
    return Game.VC;
  }
  if (game === 'sa') {
    return Game.SA;
  }

  return undefined;
}
