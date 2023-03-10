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
  contrats: any[];
  contrats2: any[];
  tree: TreeNode[] = [];
  selectedFile: TreeNode;
  selectedContrat: any[];
  selectedContrat2: any[];
  selectedContrats: any[];
  unselectedContrats: any[];

  constructor(
    private apiService: ApiService,
    private primengConfig: PrimeNGConfig
  ) {
    this.items = [];

    this.apiService.getUsers().then((users) => {
      this.users = users.map((user) => {
        user.items.forEach(
          (item) => (item.displayLabel = user.label + '-' + item.label)
        );
        return user;
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

  gererContrats() {
    this.contrats = [];

    const lcontrats = this.users.map((u) => {
      return u.items.map((g) => {
        if (this.selectedGroupes.find((a) => a === g)) {
          return g.items;
        }
      });
    });
    this.contrats = lcontrats.reduce((acc, val) => acc.concat(val), []);

    this.contrats = this.contrats.reduce((acc, val) => {
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

    console.log('contrats', this.contrats);

    if (this.contrats.length === 0) {
      this.unselectedContrats = null;
    }

    this.selectedContrat = this.contrats.filter((contrat) => {
      if (this.unselectedContrats) {
        return !this.unselectedContrats.some((c) => c.value === contrat.value);
      }
      return true;
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
