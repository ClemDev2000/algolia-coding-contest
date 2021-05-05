import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../lib/context';
import { auth, authCredential } from '../lib/firebase';
import { fetchDeleteJSON, fetchPostJSON } from '../utils/api-helpers';
import { Modal, ModalField, ModalFooter } from './Modals';

export default function ProductModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, userdata } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(userdata?.name ?? '');
  const [email, setEmail] = useState(userdata?.address ?? '');
  const [address, setAddress] = useState(userdata?.address ?? '');

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (
        (name && name !== userdata?.name) ||
        (address && address !== userdata?.address) ||
        (email && email !== userdata?.email)
      ) {
        await fetchPostJSON(
          '/api/users/profile',
          {
            ...(name && name !== userdata?.name && { name }),
            ...(address && address !== userdata?.address && { address }),
            ...(email && email !== userdata?.email && { email }),
          },
          {
            token: await user.getIdToken(),
          }
        );
        if (email) await user.sendEmailVerification();
      }
      if (password && newPassword) {
        const credential = authCredential(user.email, password);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
      }
      closeModal();
    } catch (err) {
      console.warn(err.message);
    }
    setLoading(false);
  };

  const handleDeleteProfile: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    setLoading(true);
    try {
      e.preventDefault();
      await fetchDeleteJSON('/api/users', {
        token: await user.getIdToken(),
      });
      closeModal();
      await auth.signOut();
      window.location.reload();
    } catch (err) {
      console.warn(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userdata) {
      setName(userdata.name);
      setEmail(userdata.email);
      setAddress(userdata.address);
    }
  }, [userdata]);

  function closeModal() {
    setOpen(false);
    setPassword('');
    setNewPassword('');
  }

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      title="Update my profile"
      onSubmit={handleUpdateProfile}
    >
      <ModalField
        label="Name"
        id="name"
        name="name"
        type="text"
        required
        value={name}
        setValue={setName}
      />
      <ModalField
        label="Email"
        id="email"
        name="email"
        type="email"
        required
        value={email}
        setValue={setEmail}
      />
      <ModalField
        label="Address"
        id="address"
        name="address"
        type="text"
        required
        disabled
        value={address}
        setValue={setAddress}
      />

      <div className="pt-5">
        <ModalField
          label="Password"
          id="password"
          name="password"
          type="password"
          value={password}
          setValue={setPassword}
        />
      </div>

      <ModalField
        label="New password"
        id="new_password"
        name="new_password"
        type="password"
        value={newPassword}
        setValue={setNewPassword}
      />

      <ModalFooter
        loading={loading}
        mainButtonText="Update"
        closeModal={closeModal}
        showDeleteButton
        onClickDelete={handleDeleteProfile}
        deleteButtonText="Close my account"
      />
    </Modal>
  );
}
