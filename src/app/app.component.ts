import { Component } from '@angular/core';
import { SelectItem, PrimeNGConfig, TreeNode } from 'primeng/api';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ApiService],
})
export class AppComponent {
  selectedGroupes: any[] = [];
  selectedGroupes2: any[] = [];
  selectedUsers: any[];
  selectedUsers2: any[];
  items: SelectItem[];
  item: string;
  users: any[];
  groupeContrats: any[];
  users2: any[];
  groupeContrats2: any[];
  contrats: any[] = [];
  contrats2: any[];
  tree: TreeNode[] = [];
  selectedFile: TreeNode;
  selectedContrat: any[];
  selectedContrat2: any[];
  selectedContrats: any[];
  unselectedContrats: any[];
  checked: boolean = true;
  groupes = [];

  constructor(
    private apiService: ApiService,
    private primengConfig: PrimeNGConfig
  ) {
    this.items = [];

    this.apiService.getUsers().then((users) => {
      this.users = users.map((user) => {
        //this.groupes = this.groupes.concat(user.items);
        user.items.forEach((item) => {
          if (
            !this.groupes.some((g) =>
              g.items.some((u) => u.value === user.value)
            )
          ) {
            this.groupes.push({
              label: item.label,
              value: item.value,
              items: [{ label: user.label, value: user.value }],
            });
          } else {
            const groupe = this.groupes.find((g) => g.value === item.value);

            if (groupe) {
              groupe.items.push({ label: user.label, value: user.value });
            } else {
              this.groupes.push({
                label: item.label,
                value: item.value,
                items: [{ label: user.label, value: user.value }],
              });
            }
          }

          this.contrats = this.contrats.concat(item.items);
          item.displayLabel = user.label + '-' + item.label;
        });
        return user;
      });

      this.contrats = this.contrats.reduce((acc, cur) => {
        if (!acc.some((c) => c.value === cur.value)) {
          acc.push(cur);
        }
        return acc;
      }, []);

      let groupes = [];

      this.groupes.forEach((groupe1) => {
        const g = groupes.find((g) => g.value === groupe1.value);
        if (g) {
          const t = groupe1.items.filter(
            (u) => !g.items.some((u1) => u1.value === u.value)
          );

          console.log('ben1', t);

          g.items.push(t[0]);

          console.log('ben2', g);
        } else {
          groupes.push(groupe1);
        }
      });

      this.groupes = groupes;
      console.log('ben3', groupes);

      this.contrats = this.contrats.sort((t1, t2) => {
        const name1 = t1.value;
        const name2 = t2.value;
        if (name1 > name2) {
          return 1;
        }
        if (name1 < name2) {
          return -1;
        }
        return 0;
      });

      this.users2 = this.users;
      users.forEach((user) => {
        const pere = {
          label: user.label,
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
          expanded: true,
          children: [],
        };
        if (user.items) {
          user.items.forEach((item) => {
            const groupe = {
              expanded: true,
              label: item.label,
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: [],
            };
            if (item.items) {
              item.items.forEach((contrat) => {
                const c = {
                  label: contrat.label,
                };
                groupe.children.push(c);
              });
            }
            pere.children.push(groupe);
          });
        }
        this.tree.push(pere);
      });
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  onChangeContrats() {
    if (this.contrats) {
      this.unselectedContrats = this.contrats.filter((contrat) => {
        return !this.selectedContrat.some((c) => c.value === contrat.value);
      });
    }
  }

  gererContratsGroupe() {
    let lcontrats = this.users.map((u) => {
      return u.items.map((g) => {
        if (this.selectedGroupes.find((a) => a === g)) {
          return g.items;
        }
      });
    });

    lcontrats = lcontrats.reduce((acc, val) => acc.concat(val), []);

    lcontrats = lcontrats.reduce((acc, val) => {
      if (val) {
        console.log('value', val);
        if (!acc.some((c) => val.some((v) => v.value === c.value))) {
          console.log('acc1');
          return acc.concat(val);
        }
      }
      console.log('acc', acc);
      return acc;
    }, []);

    this.selectedContrat = this.contrats.filter((contrat) => {
      return lcontrats.some((c) => c.value === contrat.value);
    });
  }

  gererContrats() {
    let lcontrats = this.users.map((u) => {
      return u.items.map((g) => {
        if (this.selectedGroupes.find((a) => a === g)) {
          return g.items;
        }
      });
    });

    lcontrats = lcontrats.reduce((acc, val) => acc.concat(val), []);

    lcontrats = lcontrats.reduce((acc, val) => {
      if (val) {
        console.log('value', val);
        if (!acc.some((c) => val.some((v) => v.value === c.value))) {
          console.log('acc1');
          return acc.concat(val);
        }
      }
      console.log('acc', acc);
      return acc;
    }, []);

    this.selectedContrat = this.contrats.filter((contrat) => {
      return lcontrats.some((c) => c.value === contrat.value);
    });
  }

  gererUsers() {
    const cs = this.selectedUsers2.map((user) => {
      return user.items.map((item) =>
        this.groupeContrats2.find((groupe) => groupe.value === item.value)
      );
    });

    this.selectedGroupes2 = cs
      .reduce((acc, val) => acc.concat(val), [])
      .reduce((acc, val) => {
        if (!acc.includes(val)) {
          acc.push(val);
        }
        return acc;
      }, []);

    this.gererContrats2();
    console.log(this.selectedGroupes2);
  }

  gererGroupes() {
    this.selectedUsers2 = this.users2.filter((user) =>
      user.items.some((groupe) =>
        this.selectedGroupes2.some((select) => select.value === groupe.value)
      )
    );

    this.gererContrats2();
    console.log(this.selectedUsers2);
  }

  gererContrats2() {
    this.contrats2 = [];
    const cs = this.selectedGroupes2.map((groupe) => {
      return groupe.items.map((item) => item);
    });

    this.contrats2 = cs.reduce((acc, val) => acc.concat(val), []);
    this.selectedContrat2 = this.contrats2;
    console.log(this.selectedContrat2);
  }
}
