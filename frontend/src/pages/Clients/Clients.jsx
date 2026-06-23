import PageWrapper from "../../components/layout/PageWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as clients from "../../api/clients";
import { useState, useMemo } from "react";
import ClientForm from "../../components/forms/ClientForm";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import ScreenState from "../../components/ui/ScreenState";
import { useSortableData } from "../../hooks/useSortableData";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableUnitBadge,
} from "../../components/ui/Table";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import Toast from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useDebounce } from "../../hooks/useDebounce";
import SearchInput from "../../components/ui/SearchInput";

function ClientSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-6 bg-background px-5 py-2.5 gap-4">
        {["w-12", "w-8", "w-20", "w-28", "w-12", "w-8"].map((w, i) => (
          <Skeleton key={i} className={`h-2.5 ${w}`} />
        ))}
      </div>
      <div className="divide-y bg-surface divide-border">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 items-center px-5 py-2.5 gap-4"
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-4 w-10 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toasts, addToast, removeToast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: clients.getClients,
  });

  const searchedData = useMemo(() => {
    if (!data) return [];
    if (!debouncedSearchTerm) return data;
    const term = debouncedSearchTerm.toLowerCase();
    return data.filter(
      (item) =>
        (item.contact_name && item.contact_name.toLowerCase().includes(term)) ||
        (item.company_name && item.company_name.toLowerCase().includes(term)) ||
        (item.email && item.email.toLowerCase().includes(term)) ||
        (item.country && item.country.toLowerCase().includes(term)),
    );
  }, [data, debouncedSearchTerm]);

  const { sortedData, sortKey, direction, toggleSort } = useSortableData(
    searchedData,
    null,
  );
  const { paginatedData, page, totalPages, goToPage } = usePagination(
    sortedData,
    10,
  );

  const clientDisplayName = (client) =>
    client?.company_name || client?.contact_name || "Client";

  const createMutation = useMutation({
    mutationFn: clients.createClient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsModalOpen(false);
      addToast(
        `"${variables.company_name || variables.contact_name}" added successfully.`,
        "created",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clients.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setEditingClient(null);
      addToast(
        `"${variables.data.company_name || variables.data.contact_name}" updated.`,
        "updated",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: clients.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      addToast(`"${clientDisplayName(clientToDelete)}" deleted.`, "deleted");
      setClientToDelete(null);
    },
  });

  const handleDelete = (client) => setClientToDelete(client);

  const confirmDelete = () => {
    deleteMutation.mutate(clientToDelete.id);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search clients..."
        />
        <Button onClick={() => setIsModalOpen(true)}>+ Add Client</Button>
      </div>

      {searchTerm && searchedData.length > 0 && (
        <p className="text-sm text-text-muted mb-4">
          Found {searchedData.length}{" "}
          {searchedData.length === 1 ? "result" : "results"} for "{searchTerm}"
        </p>
      )}

      {isLoading ? (
        <ClientSkeleton />
      ) : error ? (
        <ScreenState type="error" onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <ScreenState
          type="empty"
          title="No clients yet"
          description="Add your first client to get started."
        />
      ) : searchedData.length === 0 ? (
        <ScreenState
          type="no-results"
          title="No results found"
          description={`No clients match "${searchTerm}". Try a different search.`}
          action={{ label: "Clear search", onClick: () => setSearchTerm("") }}
        />
      ) : (
        <Table
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              goToPage={goToPage}
              totalItems={sortedData.length}
              pageSize={10}
            />
          }
        >
          <TableHeader>
            <TableRow>
              <TableHead
                sortKey="company_name"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Company Name
              </TableHead>
              <TableHead
                sortKey="contact_name"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Contact Name
              </TableHead>
              <TableHead
                sortKey="email"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Email
              </TableHead>
              <TableHead
                sortKey="country"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Country
              </TableHead>
              <TableHead
                sortKey="currency"
                currentSort={sortKey}
                direction={direction}
                onSort={toggleSort}
              >
                Currency
              </TableHead>
              <TableHead align="right" className="w-px"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.company_name || "—"}
                </TableCell>
                <TableCell>{client.contact_name || "—"}</TableCell>
                <TableCell className="text-text-muted">
                  {client.email}
                </TableCell>
                <TableCell>{client.country}</TableCell>
                <TableCell>
                  <TableUnitBadge>{client.currency}</TableUnitBadge>
                </TableCell>
                <TableCell align="right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="p-1 text-text-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(client)}
                      className="p-1 text-text-muted hover:text-danger transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isModalOpen || !!editingClient}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        title={editingClient ? "Edit Client" : "Add Client"}
        dismissable={false}
      >
        <ClientForm
          defaultValues={editingClient}
          isEditing={!!editingClient}
          onSubmit={(formData) => {
            if (editingClient) {
              updateMutation.mutate({ id: editingClient.id, data: formData });
            } else {
              createMutation.mutate(formData);
            }
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingClient(null);
          }}
          error={createMutation.error || updateMutation.error}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete client"
        description={`Are you sure you want to delete "${clientDisplayName(clientToDelete)}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  );
}
