'use client';
import { useState, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useMutationState,
} from '@tanstack/react-query';
import {
  getItems,
  addItem,
  updateItem,
  toggleItem,
  deleteItem,
  type Item,
} from '../../lib/api';

const qk = { items: ['items'] as const };

export default function Home() {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Query: Get all items
  const {
    data: items = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: qk.items,
    queryFn: getItems,
  });

  // Mutation: Add
  const createMutation = useMutation({
    mutationFn: (title: string) => addItem(title),
    onSuccess: (created) => {
      qc.setQueryData<Item[]>(qk.items, (old = []) => [created, ...old]);
      setTitle('');
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateItem(id, { title }),
    onSuccess: (updated) => {
      qc.setQueryData<Item[]>(qk.items, (old = []) =>
        old.map((i) => (i._id === updated._id ? updated : i)),
      );
      setEditingId(null);
      setEditingTitle('');
    },
  });

  // Mutation: Toggle Done
  const toggleMutation = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      toggleItem(id, done),
    onSuccess: (updated) => {
      qc.setQueryData<Item[]>(qk.items, (old = []) =>
        old.map((i) => (i._id === updated._id ? updated : i)),
      );
    },
  });

  // Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Item[]>(qk.items, (old = []) =>
        old.filter((i) => i._id !== id),
      );
    },
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-cyan-100 to-purple-200 p-6 flex items-center justify-center flex-col'>
      <main className='w-full max-w-xl bg-white rounded-xl shadow-2xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2'>
            To-do App
          </h1>
          <div className='w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto'></div>
        </div>

        {/* Add Form */}
        <div className='mt-4 flex gap-2'>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add a title...'
            className='flex-1 rounded-lg border-2 border-cyan-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400'
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const name = title.trim();
                if (!name) return;
                createMutation.mutate(name);
              }
            }}
          />
          <button
            onClick={() => {
              const name = title.trim();
              if (!name) return;
              createMutation.mutate(name);
            }}
            disabled={createMutation.isPending}
            className='rounded-lg bg-gradient-to-r cursor-pointer hover:scale-110 from-cyan-500 to-purple-600 px-6 py-3 font-medium text-white shadow-lg hover:shadow-xl disabled:opacity-50 transition-all ease-in-out'
          >
            {createMutation.isPending ? 'Adding...' : 'Add'}
          </button>
        </div>

        {/* List */}
        <section className='mt-6 space-y-3'>
          {isPending && (
            <div className='text-purple-600 text-center font-medium'>
              Loading...
            </div>
          )}
          {isError && (
            <div className='text-red-600/50 text-center font-medium'>
              Failed to load items.
            </div>
          )}
          {!isPending && !isError && items.length === 0 && (
            <div className='text-center py-12'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 border-2 border-cyan-200 mb-4'>
                <svg
                  className='w-10 h-10 text-purple-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No Data...
              </h3>
              <p className='text-gray-500 text-sm max-w-sm mx-auto leading-relaxed'>
                Your list is empty. Add your first item using the form above to
                get started.
              </p>
            </div>
          )}
          {items.map((i) => {
            const isEditing = editingId === i._id;
            return (
              <div
                key={i._id}
                className='flex items-center gap-3 rounded-lg border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-purple-50 p-4 shadow-md'
              >
                {isEditing ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className='flex-1 rounded-lg border-2 border-cyan-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400'
                      placeholder='Edit title...'
                      autoFocus
                    />
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => {
                          const newTitle = editingTitle.trim();
                          if (!newTitle) return;
                          renameMutation.mutate({ id: i._id, title: newTitle });
                        }}
                        disabled={
                          renameMutation.isPending || !editingTitle.trim()
                        }
                        className='cursor-pointer rounded-lg border-2 border-green-300 bg-green-50 px-4 py-2 text-green-600 font-medium hover:bg-green-100 shadow-sm transition-all ease-in-out hover:scale-110 disabled:opacity-50 disabled:hover:scale-100'
                      >
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingTitle('');
                        }}
                        className='cursor-pointer rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 shadow-sm transition-all ease-in-out hover:scale-110'
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex items-center gap-3 flex-1'>
                      <input
                        type='checkbox'
                        checked={i.done}
                        onChange={(e) =>
                          toggleMutation.mutate({
                            id: i._id,
                            done: e.target.checked,
                          })
                        }
                        className='h-5 w-5 cursor-pointer rounded border-2 border-cyan-400 text-purple-600 focus:ring-purple-500'
                      />
                      <span
                        className={`flex-1 text-lg ${
                          i.done
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {i.title}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => {
                          setEditingId(i._id);
                          setEditingTitle(i.title);
                        }}
                        className='cursor-pointer rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-2 text-blue-600 font-medium hover:bg-blue-100 shadow-sm transition-all ease-in-out hover:scale-110'
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMutation.mutate(i._id)}
                        className='cursor-pointer rounded-lg border-2 border-red-300 bg-red-50 px-4 py-2 text-red-600 font-medium hover:bg-red-100 shadow-sm transition-all ease-in-out hover:scale-110'
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <footer className='absolute flex text-gray-400 bottom-10'>
        <h3>© 2025 Phummarin Rojanamarn</h3>
      </footer>
    </div>
  );
}
