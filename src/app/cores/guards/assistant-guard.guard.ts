import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AssistantGuardGuard implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.role === "assistant" ? true : false),
      tap(isAssistant => {
        if (!isAssistant) {
          console.error('Access denied - Assistants only')
          this.router.navigate(['/access-denied']);
        }
      })
    );
  }

}